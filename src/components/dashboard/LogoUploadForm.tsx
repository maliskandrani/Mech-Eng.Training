"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";
import FileUploadField from "@/components/dashboard/FileUploadField";

export default function LogoUploadForm({
  action,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <FileUploadField name="logo" accept="image/png,image/jpeg,image/webp" required className="min-w-64" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "جاري الرفع..." : "رفع الشعار"}
      </button>
      {state && !state.ok && <p className="w-full text-xs text-red-300">{state.error}</p>}
      {state?.ok && <p className="w-full text-xs text-green-300">تم تحديث الشعار بنجاح.</p>}
    </form>
  );
}
