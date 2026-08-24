"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/access";
import { savePaymentProof, assertValidPaymentProof } from "@/lib/storage";
import type { ActionResult } from "@/lib/actions/auth-actions";

const PAYMENT_METHODS = ["BANK_TRANSFER", "LIBYANA_CARD", "MADAR_CARD", "LTT_CARD", "CASH_OFFICE"] as const;

const submitSchema = z.object({
  kind: z.enum(["course", "material"]),
  targetId: z.string().trim().min(1),
  paymentMethod: z.enum(PAYMENT_METHODS),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function submitPurchaseRequest(formData: FormData): Promise<ActionResult> {
  try {
    const user = await requireRole(["STUDENT"]);
    const parsed = submitSchema.safeParse({
      kind: formData.get("kind"),
      targetId: formData.get("targetId"),
      paymentMethod: formData.get("paymentMethod"),
      note: formData.get("note"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }
    const { kind, targetId, paymentMethod, note } = parsed.data;

    const proof = formData.get("proof");
    if (!(proof instanceof File) || proof.size === 0) {
      return { ok: false, error: "يرجى رفع صورة أو ملف إثبات الدفع" };
    }
    assertValidPaymentProof(proof);

    let amount: number;
    let courseId: string | null = null;
    let materialId: string | null = null;

    if (kind === "course") {
      const course = await prisma.course.findUnique({ where: { id: targetId }, select: { price: true, published: true } });
      if (!course?.published || course.price <= 0) {
        return { ok: false, error: "هذه الدورة غير متاحة للشراء." };
      }
      amount = course.price;
      courseId = targetId;
    } else {
      const material = await prisma.material.findUnique({ where: { id: targetId }, select: { price: true } });
      if (!material || material.price == null || material.price <= 0) {
        return { ok: false, error: "هذا المرفق غير متاح للشراء." };
      }
      amount = material.price;
      materialId = targetId;
    }

    const existing = await prisma.purchaseRequest.findFirst({
      where: {
        userId: user.id,
        courseId,
        materialId,
        status: { in: ["PENDING", "RECEIVED", "APPROVED"] },
      },
    });
    if (existing) {
      return { ok: false, error: "لديك بالفعل طلب شراء قائم لهذا العنصر." };
    }

    const proofUrl = await savePaymentProof(proof, user.id);

    await prisma.purchaseRequest.create({
      data: {
        userId: user.id,
        courseId,
        materialId,
        amount,
        paymentMethod,
        proofUrl,
        note: note || null,
      },
    });

    revalidatePath("/dashboard/admin/purchases");
    revalidatePath("/dashboard/trainer/purchases");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

async function loadRequestWithReceiver(requestId: string) {
  return prisma.purchaseRequest.findUnique({
    where: { id: requestId },
    include: {
      course: { select: { trainerId: true } },
      material: { select: { lesson: { select: { section: { select: { course: { select: { trainerId: true } } } } } } } },
    },
  });
}

/** The trainer who owns the purchased course/material, or admin, may confirm the money arrived. */
export async function confirmPurchaseReceipt(requestId: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const request = await loadRequestWithReceiver(requestId);
    if (!request) return { ok: false, error: "الطلب غير موجود" };

    const receiverId = request.course?.trainerId ?? request.material?.lesson.section.course.trainerId;
    if (user.role !== "ADMIN" && user.id !== receiverId) {
      return { ok: false, error: "لا تملك صلاحية تأكيد استلام هذا الطلب." };
    }
    if (request.status !== "PENDING") {
      return { ok: false, error: "لا يمكن تأكيد استلام طلب في هذه الحالة." };
    }

    await prisma.purchaseRequest.update({
      where: { id: requestId },
      data: { status: "RECEIVED", receivedById: user.id, receivedAt: new Date() },
    });

    revalidatePath("/dashboard/admin/purchases");
    revalidatePath("/dashboard/trainer/purchases");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

/** Final approval — admin only, and only after the receiver has confirmed the payment. */
export async function approvePurchase(requestId: string): Promise<ActionResult> {
  try {
    const admin = await requireRole(["ADMIN"]);
    const request = await prisma.purchaseRequest.findUnique({ where: { id: requestId } });
    if (!request) return { ok: false, error: "الطلب غير موجود" };
    if (request.status !== "RECEIVED") {
      return { ok: false, error: "يجب تأكيد استلام الدفع أولاً قبل الموافقة." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.purchaseRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED", approvedById: admin.id, approvedAt: new Date() },
      });
      if (request.courseId) {
        await tx.enrollment.upsert({
          where: { userId_courseId: { userId: request.userId, courseId: request.courseId } },
          update: {},
          create: { userId: request.userId, courseId: request.courseId },
        });
      }
    });

    revalidatePath("/dashboard/admin/purchases");
    revalidatePath("/dashboard/trainer/purchases");
    revalidatePath("/dashboard");
    revalidatePath("/courses");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function rejectPurchase(requestId: string, reason: string): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const request = await prisma.purchaseRequest.findUnique({ where: { id: requestId } });
    if (!request) return { ok: false, error: "الطلب غير موجود" };
    if (request.status === "APPROVED") {
      return { ok: false, error: "لا يمكن رفض طلب تمت الموافقة عليه بالفعل." };
    }

    await prisma.purchaseRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED", rejectionReason: reason.trim() || null },
    });

    revalidatePath("/dashboard/admin/purchases");
    revalidatePath("/dashboard/trainer/purchases");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
