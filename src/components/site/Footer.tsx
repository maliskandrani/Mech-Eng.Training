import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const [t, tNav, tBrand] = await Promise.all([
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("brand"),
  ]);

  return (
    <footer className="border-t border-border bg-background-elevated">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient text-accent-foreground font-bold">
                م
              </span>
              <span className="font-bold text-foreground">{tBrand("line1")} {tBrand("line2")}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{t("description")}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">{t("quickLinks")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/courses" className="hover:text-accent">{tNav("courses")}</Link></li>
              <li><Link href="/trainers" className="hover:text-accent">{tNav("trainers")}</Link></li>
              <li><Link href="/login" className="hover:text-accent">{tNav("login")}</Link></li>
              <li><Link href="/register" className="hover:text-accent">{tNav("signup")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">{t("contactTitle")}</h4>
            <p className="mt-3 text-sm text-muted">{t("contactText")}</p>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
