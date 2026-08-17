"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/access";
import type { ActionResult } from "@/lib/actions/auth-actions";

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function submitReview(courseId: string, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (!enrollment) return { ok: false, error: "يجب أن تكون ملتحقًا بالدورة لتقييمها." };

    const parsed = reviewSchema.safeParse({
      rating: formData.get("rating"),
      comment: formData.get("comment"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }
    const { rating, comment } = parsed.data;

    await prisma.review.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      update: { rating, comment: comment || null },
      create: { userId: user.id, courseId, rating, comment: comment || null },
    });

    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function deleteReview(reviewId: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const review = await prisma.review.findUnique({ where: { id: reviewId }, select: { userId: true } });
    if (!review) return { ok: false, error: "التقييم غير موجود" };
    if (review.userId !== user.id && user.role !== "ADMIN") {
      return { ok: false, error: "لا تملك صلاحية حذف هذا التقييم" };
    }
    await prisma.review.delete({ where: { id: reviewId } });
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
