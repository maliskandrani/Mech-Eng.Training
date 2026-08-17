"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function ReviewForm({
  action,
  initialRating = 0,
  initialComment = "",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  initialRating?: number;
  initialComment?: string;
}) {
  const t = useTranslations("courses");
  const [rating, setRating] = useState(initialRating);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-700">
        {t("reviewSaved")}
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-xl border border-border bg-background-card p-4">
      <input type="hidden" name="rating" value={rating} />
      <p className="text-sm font-semibold text-foreground">{t("yourRating")}</p>
      <div className="mt-1.5 flex items-center gap-1 text-2xl">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n}`}
            className={n <= rating ? "text-accent" : "text-border transition hover:text-accent/60"}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={3}
        defaultValue={initialComment}
        placeholder={t("commentPlaceholder")}
        className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      {state && !state.ok && <p className="mt-2 text-xs text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending || rating === 0}
        className="mt-3 rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submitReview")}
      </button>
    </form>
  );
}
