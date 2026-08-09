"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function CreateUserForm({
  action,
  role,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  role: "TRAINER" | "STUDENT";
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-border bg-background-card p-4 sm:grid-cols-2">
      <input type="hidden" name="role" value={role} />
      <input
        name="name"
        required
        placeholder="الاسم الكامل"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="البريد الإلكتروني"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="كلمة المرور (8 أحرف على الأقل)"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      {role === "TRAINER" && (
        <input
          name="title"
          placeholder="اللقب الوظيفي (اختياري)"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60 sm:col-span-2"
      >
        {pending ? "جاري الإضافة..." : role === "TRAINER" ? "+ إضافة مدرب" : "+ إضافة متدرب"}
      </button>
      {state && !state.ok && <p className="text-sm text-red-700 sm:col-span-2">{state.error}</p>}
      {state?.ok && <p className="text-sm text-green-700 sm:col-span-2">تمت الإضافة بنجاح.</p>}
    </form>
  );
}
