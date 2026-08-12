import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth, signOut } from "@/lib/auth";
import { getSiteSettings } from "@/lib/queries";
import { ROLE_LABELS } from "@/lib/utils";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import BrandLockup from "@/components/site/BrandLockup";

export default async function Header() {
  const [session, settings, t, tFooter] = await Promise.all([
    auth(),
    getSiteSettings(),
    getTranslations("nav"),
    getTranslations("footer"),
  ]);

  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/trainers", label: t("trainers") },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <div className="border-b border-white/10 bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-xs sm:px-6">
          <Link href="/contact" className="flex items-center gap-1.5 text-navy-muted transition hover:text-accent">
            <span aria-hidden>✉️</span>
            <span>{tFooter("contactTitle")}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="border-b border-border/80 bg-background/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="shrink-0">
            <BrandLockup
              logoUrl={settings?.logoUrl}
              size={120}
              nameClassName="text-foreground text-sm sm:text-base"
              translatedClassName="text-muted"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <NextLink
                  href="/dashboard"
                  className="hidden text-sm text-muted sm:block"
                  title={session.user.email ?? undefined}
                >
                  {session.user.name} · {ROLE_LABELS[session.user.role]}
                </NextLink>
                <NextLink
                  href="/dashboard"
                  className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                >
                  {t("dashboard")}
                </NextLink>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-accent hover:text-accent"
                  >
                    {t("logout")}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-navy/25 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-navy-foreground"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
