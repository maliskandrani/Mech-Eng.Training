"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { registerStudent } from "@/lib/actions/auth-actions";

export async function loginAction(formData: FormData): Promise<{ ok: false; error: string } | undefined> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") || "/dashboard");

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
    }
    throw error;
  }
}

export async function registerAction(formData: FormData): Promise<{ ok: false; error: string } | undefined> {
  const result = await registerStudent(formData);
  if (!result.ok) return result;

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "تم إنشاء الحساب، يرجى تسجيل الدخول." };
    }
    throw error;
  }
}
