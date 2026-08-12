import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/queries";
import BrandLockup from "@/components/site/BrandLockup";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const [t, settings] = await Promise.all([getTranslations("auth"), getSiteSettings()]);

  return (
    <div className="grid min-h-[calc(100vh-61px)] lg:grid-cols-2">
      <div className="hero-navy hidden flex-col items-start justify-center px-12 py-16 text-navy-foreground lg:flex">
        <BrandLockup
          logoUrl={settings?.logoUrl}
          size={56}
          nameClassName="text-2xl text-navy-foreground"
          translatedClassName="text-navy-muted text-sm"
        />
        <p className="mt-6 max-w-sm leading-7 text-navy-muted">{t("loginSubtitle")}</p>
      </div>

      <div className="flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-foreground">{t("loginTitle")}</h1>
          <p className="mt-2 text-muted">{t("loginSubtitle")}</p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
