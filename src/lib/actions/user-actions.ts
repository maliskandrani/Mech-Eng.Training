"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser, requireCourseManager } from "@/lib/access";
import { savePublicImage, assertValidPoster } from "@/lib/storage";
import type { ActionResult } from "@/lib/actions/auth-actions";

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  nameEn: z.string().trim().max(120).nullish(),
  designation: z.enum(["NONE", "ENGINEER", "DOCTOR", "PROFESSOR"]).nullish(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  role: z.enum(["TRAINER", "STUDENT"]),
  title: z.string().trim().max(200).nullish(),
  titleEn: z.string().trim().max(200).nullish(),
  phone: z.string().trim().max(30).nullish(),
  socialUrl: z.string().trim().max(300).nullish(),
});

export async function createUser(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const parsed = createUserSchema.safeParse({
      name: formData.get("name"),
      nameEn: formData.get("nameEn"),
      designation: formData.get("designation"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
      title: formData.get("title"),
      titleEn: formData.get("titleEn"),
      phone: formData.get("phone"),
      socialUrl: formData.get("socialUrl"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }
    const { name, nameEn, designation, email, password, role, title, titleEn, phone, socialUrl } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { ok: false, error: "هذا البريد الإلكتروني مستخدم مسبقًا." };

    let avatarUrl: string | undefined;
    const avatar = formData.get("avatar");
    if (avatar instanceof File && avatar.size > 0) {
      assertValidPoster(avatar);
      avatarUrl = await savePublicImage(avatar, "avatars");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        nameEn: nameEn || null,
        designation: designation ?? "NONE",
        email,
        passwordHash,
        role,
        title: title || null,
        titleEn: titleEn || null,
        phone: phone || null,
        socialUrl: socialUrl || null,
        avatarUrl,
      },
    });

    revalidatePath("/dashboard/admin/trainers");
    revalidatePath("/dashboard/admin/students");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    const admin = await requireRole(["ADMIN"]);
    if (admin.id === userId) return { ok: false, error: "لا يمكنك حذف حسابك الخاص." };
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/admin/trainers");
    revalidatePath("/dashboard/admin/students");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function enrollStudent(courseId: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireCourseManager(courseId);
    const identifier = String(formData.get("studentIdentifier") ?? "").trim();
    if (!identifier) return { ok: false, error: "أدخل البريد الإلكتروني أو رقم الهاتف أو حساب التواصل الاجتماعي." };

    const student = await prisma.user.findFirst({
      where: {
        role: "STUDENT",
        OR: [
          { email: identifier.toLowerCase() },
          { phone: identifier },
          { socialUrl: { contains: identifier } },
        ],
      },
    });
    if (!student) {
      return { ok: false, error: "لا يوجد متدرب مطابق لهذه البيانات." };
    }
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student.id, courseId } },
      update: {},
      create: { userId: student.id, courseId },
    });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function enrollSelf(courseId: string): Promise<ActionResult> {
  try {
    const user = await requireRole(["STUDENT"]);
    const course = await prisma.course.findUnique({ where: { id: courseId }, select: { published: true } });
    if (!course?.published) return { ok: false, error: "هذه الدورة غير متاحة للتسجيل حاليًا." };

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      update: {},
      create: { userId: user.id, courseId },
    });
    revalidatePath("/dashboard");
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function unenrollStudent(enrollmentId: string): Promise<ActionResult> {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { courseId: true },
    });
    if (!enrollment) return { ok: false, error: "التسجيل غير موجود" };
    await requireCourseManager(enrollment.courseId);
    await prisma.enrollment.delete({ where: { id: enrollmentId } });
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  nameEn: z.string().trim().max(120).nullish(),
  designation: z.enum(["NONE", "ENGINEER", "DOCTOR", "PROFESSOR"]).nullish(),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  titleEn: z.string().trim().max(200).nullish(),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
});

export async function updateOwnProfile(formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const parsed = profileSchema.safeParse({
      name: formData.get("name"),
      nameEn: formData.get("nameEn"),
      designation: formData.get("designation"),
      title: formData.get("title"),
      titleEn: formData.get("titleEn"),
      bio: formData.get("bio"),
      phone: formData.get("phone"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }
    const data = parsed.data;

    let avatarUrl: string | undefined;
    const avatar = formData.get("avatar");
    if (avatar instanceof File && avatar.size > 0) {
      assertValidPoster(avatar);
      avatarUrl = await savePublicImage(avatar, "avatars");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        nameEn: data.nameEn || null,
        ...(data.designation ? { designation: data.designation } : {}),
        title: data.title || null,
        titleEn: data.titleEn || null,
        bio: data.bio || null,
        phone: data.phone || null,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/trainers");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
