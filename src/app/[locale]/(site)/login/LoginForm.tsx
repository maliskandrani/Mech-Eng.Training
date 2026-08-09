"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { loginAction } from "@/lib/actions/session-actions";

type State = { ok: false; error: string } | null;

export default function LoginForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [state, formAction, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    const res = await loginAction(formData);
    return res ?? null;
  }, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("email")}</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("password")}</label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl gold-gradient px-6 py-3 font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t("loggingIn") : t("loginButton")}
      </button>

      <p className="text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-accent hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}
