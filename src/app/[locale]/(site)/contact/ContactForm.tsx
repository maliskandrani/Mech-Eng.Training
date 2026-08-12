"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactMessage } from "@/lib/actions/contact-actions";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => submitContactMessage(formData),
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-6 text-green-700">
        {t("successMessage")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border bg-background-card p-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("formName")}</label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("formContact")}</label>
        <input
          name="contactInfo"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("formType")}</label>
        <select
          name="type"
          defaultValue="INQUIRY"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-accent"
        >
          <option value="INQUIRY">{t("typeInquiry")}</option>
          <option value="SUGGESTION">{t("typeSuggestion")}</option>
          <option value="COMPLAINT">{t("typeComplaint")}</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("formMessage")}</label>
        <textarea
          name="message"
          required
          rows={5}
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
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
