"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";
import FileUploadField from "@/components/dashboard/FileUploadField";

export default function ProfileForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  initial: {
    name: string;
    nameEn: string | null;
    designation: string;
    title: string | null;
    titleEn: string | null;
    bio: string | null;
    bioEn: string | null;
    phone: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-2xl border border-border bg-background-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
          <label className="mb-1.5 block text-sm font-medium text-muted">الاسم بالإنجليزية (اختياري)</label>
          <input
            name="nameEn"
            dir="ltr"
            defaultValue={initial.nameEn ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">الصفة</label>
        <select
          name="designation"
          defaultValue={initial.designation}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        >
          <option value="NONE">بدون صفة</option>
          <option value="ENGINEER">مهندس</option>
          <option value="DOCTOR">دكتور</option>
          <option value="PROFESSOR">أستاذ</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">اللقب الوظيفي</label>
          <input
            name="title"
            defaultValue={initial.title ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">اللقب الوظيفي بالإنجليزية (اختياري)</label>
          <input
            name="titleEn"
            dir="ltr"
            defaultValue={initial.titleEn ?? ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
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
        <label className="mb-1.5 block text-sm font-medium text-muted">نبذة تعريفية بالإنجليزية (اختياري)</label>
        <textarea
          name="bioEn"
          dir="ltr"
          rows={5}
          defaultValue={initial.bioEn ?? ""}
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
        <FileUploadField name="avatar" accept="image/png,image/jpeg,image/webp" />
        <p className="mt-1.5 text-xs text-muted">
          تُعرض الصورة تلقائيًا داخل إطار دائري — يفضّل رفع صورة مربعة والوجه في المنتصف أو
          الجزء العلوي منها ليبقى واضحًا بعد القص.
        </p>
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
