"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function EnrollForm({ action }: { action: (formData: FormData) => Promise<ActionResult> }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <div className="flex-1">
        <label className="mb-1 block text-xs text-muted">
          تسجيل متدرب بالبريد الإلكتروني أو رقم الهاتف أو حساب التواصل الاجتماعي
        </label>
        <input
          name="studentIdentifier"
          required
          placeholder="student@example.com أو رقم الهاتف أو رابط فيسبوك"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "..." : "+ تسجيل"}
      </button>
      {state && !state.ok && <p className="w-full text-xs text-red-300">{state.error}</p>}
      {state?.ok && <p className="w-full text-xs text-green-300">تم التسجيل بنجاح.</p>}
    </form>
  );
}
