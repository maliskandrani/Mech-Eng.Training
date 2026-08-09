"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, requireCourseManager, requireUser } from "@/lib/access";
import { slugify } from "@/lib/utils";
import { savePublicImage, assertValidPoster } from "@/lib/storage";
import type { ActionResult } from "@/lib/actions/auth-actions";

const courseSchema = z.object({
  title: z.string().trim().min(3).max(160),
  subtitle: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  price: z.coerce.number().min(0).max(1_000_000),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  categoryId: z.string().trim().optional().or(z.literal("")),
  trainerId: z.string().trim().min(1),
  introVideoUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "course";
  let slug = root;
  let i = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${root}-${++i}`;
  }
  return slug;
}

export async function createCourse(formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireRole(["ADMIN", "TRAINER"]);
    const parsed = courseSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      description: formData.get("description"),
      price: formData.get("price") || 0,
      level: formData.get("level") || "BEGINNER",
      categoryId: formData.get("categoryId"),
      trainerId: formData.get("trainerId") || user.id,
      introVideoUrl: formData.get("introVideoUrl"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }
    const data = parsed.data;
    // Trainers can only create courses under their own name; only admins may assign a different trainer.
    if (user.role === "TRAINER") data.trainerId = user.id;
    const slug = await uniqueSlug(data.title);

    let posterUrl: string | undefined;
    const poster = formData.get("poster");
    if (poster instanceof File && poster.size > 0) {
      assertValidPoster(poster);
      posterUrl = await savePublicImage(poster, "posters");
    }

    await prisma.course.create({
      data: {
        slug,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        price: data.price,
        level: data.level,
        categoryId: data.categoryId || null,
        trainerId: data.trainerId,
        introVideoUrl: data.introVideoUrl || null,
        posterUrl,
      },
    });

    revalidatePath("/dashboard/admin/courses");
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function updateCourse(courseId: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireCourseManager(courseId);
    const parsed = courseSchema
      .omit({ trainerId: true })
      .extend({ trainerId: z.string().trim().optional() })
      .safeParse({
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        description: formData.get("description"),
        price: formData.get("price") || 0,
        level: formData.get("level") || "BEGINNER",
        categoryId: formData.get("categoryId"),
        trainerId: formData.get("trainerId") ?? undefined,
        introVideoUrl: formData.get("introVideoUrl"),
      });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }
    const data = parsed.data;
    const user = await requireUser();

    let posterUrl: string | undefined;
    const poster = formData.get("poster");
    if (poster instanceof File && poster.size > 0) {
      assertValidPoster(poster);
      posterUrl = await savePublicImage(poster, "posters");
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        price: data.price,
        level: data.level,
        categoryId: data.categoryId || null,
        introVideoUrl: data.introVideoUrl || null,
        ...(posterUrl ? { posterUrl } : {}),
        ...(user.role === "ADMIN" && data.trainerId ? { trainerId: data.trainerId } : {}),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function setCoursePublished(courseId: string, published: boolean): Promise<ActionResult> {
  try {
    await requireCourseManager(courseId);
    await prisma.course.update({ where: { id: courseId }, data: { published } });
    revalidatePath("/dashboard");
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    await prisma.course.delete({ where: { id: courseId } });
    revalidatePath("/dashboard/admin/courses");
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function createModule(courseId: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireCourseManager(courseId);
    const title = String(formData.get("title") ?? "").trim();
    if (title.length < 2) return { ok: false, error: "عنوان الوحدة قصير جدًا" };

    const count = await prisma.module.count({ where: { courseId } });
    await prisma.module.create({ data: { courseId, title, order: count + 1 } });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function deleteModule(moduleId: string): Promise<ActionResult> {
  try {
    const mod = await prisma.module.findUnique({ where: { id: moduleId }, select: { courseId: true } });
    if (!mod) return { ok: false, error: "الوحدة غير موجودة" };
    await requireCourseManager(mod.courseId);
    await prisma.module.delete({ where: { id: moduleId } });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
