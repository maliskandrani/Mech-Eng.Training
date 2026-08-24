"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitPurchaseRequest } from "@/lib/actions/purchase-actions";
import FileUploadField from "@/components/dashboard/FileUploadField";
import type { ActionResult } from "@/lib/actions/auth-actions";

const METHODS = ["BANK_TRANSFER", "LIBYANA_CARD", "MADAR_CARD", "LTT_CARD", "CASH_OFFICE"] as const;

export default function PurchaseForm({ kind, targetId }: { kind: "course" | "material"; targetId: string }) {
  const t = useTranslations("courses");
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => submitPurchaseRequest(formData),
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-6 text-center text-green-700">
        {t("purchaseSubmitted")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-background-card p-6">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="targetId" value={targetId} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("paymentMethodLabel")}</label>
        <select
          name="paymentMethod"
          defaultValue="BANK_TRANSFER"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {t(`method.${m}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("proofLabel")}</label>
        <FileUploadField name="proof" accept="image/*,.pdf" required />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("noteLabel")}</label>
        <textarea
          name="note"
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      {state && !state.ok && (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl gold-gradient px-6 py-3 font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t("submittingPurchase") : t("submitPurchase")}
      </button>
    </form>
  );
}
