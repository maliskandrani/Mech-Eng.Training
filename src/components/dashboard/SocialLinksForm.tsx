"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";
import { SOCIAL_LINK_FIELDS, type SocialLinkFieldName } from "@/lib/social-links";

type Initial = Partial<Record<SocialLinkFieldName, string | null>>;

export default function SocialLinksForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  initial: Initial;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {SOCIAL_LINK_FIELDS.map((f) => (
        <div key={f.name}>
          <label className="mb-1.5 block text-sm font-medium text-muted">{f.label}</label>
          <input
            type="url"
            name={f.name}
            dir="ltr"
            defaultValue={initial[f.name] ?? ""}
            placeholder={f.placeholder}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-start text-foreground outline-none focus:border-accent"
          />
        </div>
      ))}

      {state && !state.ok && <p className="text-xs text-red-300">{state.error}</p>}
      {state?.ok && <p className="text-xs text-green-300">تم حفظ روابط التواصل الاجتماعي.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "حفظ الروابط"}
      </button>
    </form>
  );
}
