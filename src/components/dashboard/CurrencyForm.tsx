"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

const CURRENCIES = [
  { code: "LYD", label: "دينار ليبي (LYD)" },
  { code: "EGP", label: "جنيه مصري (EGP)" },
  { code: "USD", label: "دولار أمريكي (USD)" },
];

export default function CurrencyForm({
  action,
  currentCurrency,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  currentCurrency: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <select
        name="currency"
        defaultValue={currentCurrency}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "حفظ العملة"}
      </button>
      {state && !state.ok && <p className="w-full text-xs text-red-300">{state.error}</p>}
      {state?.ok && <p className="w-full text-xs text-green-300">تم تحديث العملة الرئيسية للموقع.</p>}
    </form>
  );
}
