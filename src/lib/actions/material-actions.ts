"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseManager } from "@/lib/access";
import { assertValidMaterialFile, saveMaterialFile, deleteMaterialFile } from "@/lib/storage";
import type { ActionResult } from "@/lib/actions/auth-actions";
import type { MaterialType } from "@prisma/client";

const VALID_TYPES: MaterialType[] = ["BOOK", "VIDEO", "SLIDE"];

export async function uploadMaterial(lessonId: string, formData: FormData): Promise<ActionResult> {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { section: { select: { courseId: true } } },
    });
    if (!lesson) return { ok: false, error: "الدرس غير موجود" };
    const courseId = lesson.section.courseId;
    await requireCourseManager(courseId);

    const title = String(formData.get("title") ?? "").trim();
    const type = String(formData.get("type") ?? "") as MaterialType;
    const file = formData.get("file");

    if (title.length < 2) return { ok: false, error: "عنوان الملف قصير جدًا" };
    if (!VALID_TYPES.includes(type)) return { ok: false, error: "نوع الملف غير صحيح" };
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "يرجى اختيار ملف للرفع" };
    }

    assertValidMaterialFile(file, type);
    const { relativeKey, size } = await saveMaterialFile(file, courseId);

    const count = await prisma.material.count({ where: { lessonId } });
    await prisma.material.create({
      data: {
        lessonId,
        title,
        type,
        fileUrl: relativeKey,
        fileSize: size,
        order: count + 1,
      },
    });

    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع أثناء الرفع" };
  }
}

export async function deleteMaterial(materialId: string): Promise<ActionResult> {
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      select: { fileUrl: true, lesson: { select: { section: { select: { courseId: true } } } } },
    });
    if (!material) return { ok: false, error: "الملف غير موجود" };
    await requireCourseManager(material.lesson.section.courseId);

    await prisma.material.delete({ where: { id: materialId } });
    await deleteMaterialFile(material.fileUrl);

    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
