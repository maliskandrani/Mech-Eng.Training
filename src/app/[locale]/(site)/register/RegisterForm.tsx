"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerAction } from "@/lib/actions/session-actions";
import PasswordInput from "@/components/ui/PasswordInput";

type State = { ok: false; error: string } | null;

export default function RegisterForm() {
  const t = useTranslations("auth");
  const [state, formAction, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    const res = await registerAction(formData);
    return res ?? null;
  }, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">{t("fullName")}</label>
        <input
          type="text"
          name="name"
          required
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

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
        <PasswordInput
          name="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-border bg-background-card px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
        <p className="mt-1 text-xs text-muted">{t("passwordHint")}</p>
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
        {pending ? t("registering") : t("registerButton")}
      </button>

      <p className="text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-accent hover:underline">
          {t("loginButton")}
        </Link>
      </p>
    </form>
  );
}
