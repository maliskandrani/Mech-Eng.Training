import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/queries";
import BrandLockup from "@/components/site/BrandLockup";

export default async function Footer() {
  const [settings, t, tNav] = await Promise.all([
    getSiteSettings(),
    getTranslations("footer"),
    getTranslations("nav"),
  ]);

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <BrandLockup
              logoUrl={settings?.logoUrl}
              size={40}
              nameClassName="text-navy-foreground"
              translatedClassName="text-navy-muted"
            />
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
            <h4 className="font-semibold text-navy-foreground">
              <Link href="/contact" className="hover:text-accent">{t("contactTitle")}</Link>
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-navy-muted" dir="ltr">
              <li className="text-end">
                <a href="tel:+201115248882" className="hover:text-accent">+20 111 524 8882</a>
              </li>
              <li className="text-end">
                <a href="https://wa.me/218916290814" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  +218 91 629 0814 (WhatsApp)
                </a>
              </li>
              <li className="text-end">
                <a href="mailto:albarasi37@gmail.com" className="hover:text-accent">albarasi37@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-navy-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
