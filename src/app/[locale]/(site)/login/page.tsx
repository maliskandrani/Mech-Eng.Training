import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-extrabold text-foreground">{t("loginTitle")}</h1>
      <p className="mt-2 text-muted">{t("loginSubtitle")}</p>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
