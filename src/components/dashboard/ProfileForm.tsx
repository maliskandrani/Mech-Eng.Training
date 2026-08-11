"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function ProfileForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  initial: { name: string; title: string | null; bio: string | null; phone: string | null };
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-2xl border border-border bg-background-card p-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">الاسم</label>
        <input
          name="name"
          required
          defaultValue={initial.name}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">اللقب الوظيفي</label>
        <input
          name="title"
          defaultValue={initial.title ?? ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">نبذة تعريفية</label>
        <textarea
          name="bio"
          rows={5}
          defaultValue={initial.bio ?? ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">رقم الهاتف</label>
        <input
          name="phone"
          defaultValue={initial.phone ?? ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">الصورة الشخصية</label>
        <input
          name="avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      {state && !state.ok && (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300">{state.error}</p>
      )}
      {state?.ok && (
        <p className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-300">
          تم حفظ الملف الشخصي.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl gold-gradient px-6 py-2.5 font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "حفظ التغييرات"}
      </button>
    </form>
  );
}
