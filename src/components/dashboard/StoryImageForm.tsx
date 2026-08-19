"use client";

import { useActionState } from "react";
import FileUploadField from "@/components/dashboard/FileUploadField";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function StoryImageForm({
  action,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="grid gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-2">
      <FileUploadField name="image" accept="image/png,image/jpeg,image/webp" required />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60"
      >
        {pending ? "جاري الرفع..." : "+ إضافة صورة"}
      </button>
      {state && !state.ok && <p className="text-xs text-red-300 sm:col-span-2">{state.error}</p>}
    </form>
  );
}
