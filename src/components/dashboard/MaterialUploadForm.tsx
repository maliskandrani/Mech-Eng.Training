"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function MaterialUploadForm({ action }: { action: (formData: FormData) => Promise<ActionResult> }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="mt-3 grid gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-4">
      <input
        name="title"
        required
        placeholder="عنوان الملف"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent sm:col-span-2"
      />
      <select
        name="type"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      >
        <option value="BOOK">كتاب (PDF)</option>
        <option value="VIDEO">فيديو</option>
        <option value="SLIDE">سلايدز</option>
      </select>
      <input
        name="file"
        type="file"
        required
        className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60 sm:col-span-4"
      >
        {pending ? "جاري الرفع..." : "رفع الملف"}
      </button>
      {state && !state.ok && <p className="text-xs text-red-300 sm:col-span-4">{state.error}</p>}
    </form>
  );
}
