"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseManager, requireRole } from "@/lib/access";
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

/**
 * Admin-only: set a material's price (in the site's currency). Null/0 makes it free —
 * accessible to any logged-in user without enrollment. A positive price keeps it locked
 * behind full course access, but the price is shown as an indicator of its value.
 */
export async function setMaterialPrice(materialId: string, price: number | null): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      select: { lesson: { select: { section: { select: { courseId: true, course: { select: { slug: true } } } } } } },
    });
    if (!material) return { ok: false, error: "الملف غير موجود" };

    await prisma.material.update({
      where: { id: materialId },
      data: { price: price != null && price > 0 ? price : null },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/courses/${material.lesson.section.course.slug}`);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
