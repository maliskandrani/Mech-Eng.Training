"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/access";
import { savePublicImage, assertValidPoster } from "@/lib/storage";
import type { ActionResult } from "@/lib/actions/auth-actions";

export async function updateLogo(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const logo = formData.get("logo");
    if (!(logo instanceof File) || logo.size === 0) {
      return { ok: false, error: "يرجى اختيار صورة الشعار" };
    }
    assertValidPoster(logo);
    const logoUrl = await savePublicImage(logo, "logo");

    await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: { logoUrl },
      create: { id: "main", logoUrl },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function addStoryImage(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const caption = String(formData.get("caption") ?? "").trim();
    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      return { ok: false, error: "يرجى اختيار صورة" };
    }
    assertValidPoster(image);
    const imageUrl = await savePublicImage(image, "story");

    const count = await prisma.storyImage.count();
    await prisma.storyImage.create({
      data: { imageUrl, caption: caption || null, order: count + 1 },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function deleteStoryImage(id: string): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    await prisma.storyImage.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/dashboard/admin/settings");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

const VALID_CURRENCIES = ["LYD", "EGP", "USD"];

export async function updatePaymentInfo(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const field = (name: string) => {
      const v = String(formData.get(name) ?? "").trim();
      return v || null;
    };

    await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: {
        paymentBankDetails: field("paymentBankDetails"),
        paymentLibyanaInfo: field("paymentLibyanaInfo"),
        paymentMadarInfo: field("paymentMadarInfo"),
        paymentLttInfo: field("paymentLttInfo"),
        paymentCashOfficeInfo: field("paymentCashOfficeInfo"),
      },
      create: {
        id: "main",
        paymentBankDetails: field("paymentBankDetails"),
        paymentLibyanaInfo: field("paymentLibyanaInfo"),
        paymentMadarInfo: field("paymentMadarInfo"),
        paymentLttInfo: field("paymentLttInfo"),
        paymentCashOfficeInfo: field("paymentCashOfficeInfo"),
      },
    });

    revalidatePath("/dashboard/admin/settings");
    revalidatePath("/courses", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}

export async function updateCurrency(formData: FormData): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);
    const currency = String(formData.get("currency") ?? "");
    if (!VALID_CURRENCIES.includes(currency)) {
      return { ok: false, error: "عملة غير صحيحة" };
    }

    await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: { currency },
      create: { id: "main", currency },
    });

    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "حدث خطأ غير متوقع" };
  }
}
