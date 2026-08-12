"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseManager } from "@/lib/access";
import { deleteMaterialFile } from "@/lib/storage";
import type { ActionResult } from "@/lib/actions/auth-actions";

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
