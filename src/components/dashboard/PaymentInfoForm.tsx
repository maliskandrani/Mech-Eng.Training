"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

const FIELDS: { name: string; label: string; placeholder: string }[] = [
  {
    name: "paymentBankDetails",
    label: "التحويل المصرفي",
    placeholder: "اسم البنك، اسم صاحب الحساب، رقم الحساب/IBAN...",
  },
  {
    name: "paymentLibyanaInfo",
    label: "كرت ليبيانا",
    placeholder: "الرقم الذي يُرسل إليه كود الكرت، أو أي تعليمات أخرى...",
  },
  {
    name: "paymentMadarInfo",
    label: "كرت مدار",
    placeholder: "الرقم الذي يُرسل إليه كود الكرت، أو أي تعليمات أخرى...",
  },
  {
    name: "paymentLttInfo",
    label: "كرت ليبيا للاتصالات والتقنية",
    placeholder: "الرقم الذي يُرسل إليه كود الكرت، أو أي تعليمات أخرى...",
  },
  {
    name: "paymentCashOfficeInfo",
    label: "الدفع كاش بالمكتب",
    placeholder: "عنوان المكتب/المكاتب وأوقات الدوام...",
  },
];

type Initial = Partial<Record<
  "paymentBankDetails" | "paymentLibyanaInfo" | "paymentMadarInfo" | "paymentLttInfo" | "paymentCashOfficeInfo",
  string | null
>>;

export default function PaymentInfoForm({
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
      {FIELDS.map((f) => (
        <div key={f.name}>
          <label className="mb-1.5 block text-sm font-medium text-muted">{f.label}</label>
          <textarea
            name={f.name}
            rows={2}
            defaultValue={initial[f.name as keyof Initial] ?? ""}
            placeholder={f.placeholder}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      ))}

      {state && !state.ok && <p className="text-xs text-red-300">{state.error}</p>}
      {state?.ok && <p className="text-xs text-green-300">تم حفظ بيانات الدفع.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "حفظ بيانات الدفع"}
      </button>
    </form>
  );
}
