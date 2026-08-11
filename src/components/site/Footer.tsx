import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/queries";
import Logo from "@/components/site/Logo";

export default async function Footer() {
  const [settings, t, tNav, tBrand] = await Promise.all([
    getSiteSettings(),
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("brand"),
  ]);

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Logo logoUrl={settings?.logoUrl} size={32} />
              <span className="font-bold text-navy-foreground">{tBrand("line1")} {tBrand("line2")}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-navy-muted">{t("description")}</p>
          </div>

          <div>
            <h4 className="font-semibold text-navy-foreground">{t("quickLinks")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-navy-muted">
              <li><Link href="/courses" className="hover:text-accent">{tNav("courses")}</Link></li>
              <li><Link href="/trainers" className="hover:text-accent">{tNav("trainers")}</Link></li>
              <li><Link href="/login" className="hover:text-accent">{tNav("login")}</Link></li>
              <li><Link href="/register" className="hover:text-accent">{tNav("signup")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-navy-foreground">{t("contactTitle")}</h4>
            <p className="mt-3 text-sm text-navy-muted">{t("contactText")}</p>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-navy-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
