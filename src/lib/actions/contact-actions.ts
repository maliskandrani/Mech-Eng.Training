"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/access";
import type { ActionResult } from "@/lib/actions/auth-actions";
import type { ContactMessageType } from "@prisma/client";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  contactInfo: z.string().trim().min(3).max(200),
  type: z.enum(["COMPLAINT", "SUGGESTION", "INQUIRY"]),
  message: z.string().trim().min(5).max(4000),
});

export async function submitContactMessage(formData: FormData): Promise<ActionResult> {
  try {
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      contactInfo: formData.get("contactInfo"),
      type: formData.get("type"),
      message: formData.get("message"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
    }

    await prisma.contactMessage.create({
      data: parsed.data as { name: string; contactInfo: string; type: ContactMessageType; message: string },
    });

    revalidatePath("/dashboard/admin/messages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    await prisma.contactMessage.update({ where: { id }, data: { read: true } });
    revalidatePath("/dashboard/admin/messages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/dashboard/admin/messages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
