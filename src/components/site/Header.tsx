import NextLink from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/queries";
import { roleLabel, localizedName } from "@/lib/utils";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import BrandLockup from "@/components/site/BrandLockup";

export default async function Header() {
  const [session, settings, t, tFooter, locale] = await Promise.all([
    auth(),
    getSiteSettings(),
    getTranslations("nav"),
    getTranslations("footer"),
    getLocale(),
  ]);
  const currentUser = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, nameEn: true, designation: true },
      })
    : null;
  const displayName = currentUser
    ? localizedName(currentUser.name, currentUser.nameEn, currentUser.designation, locale)
    : session?.user?.name;

  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/trainers", label: t("trainers") },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <div className="border border-accent/40 bg-background/95 shadow-sm">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex h-full shrink-0 items-center">
            <BrandLockup
              logoUrl={settings?.logoUrl}
              size={64}
              nameClassName="text-foreground text-sm sm:text-base"
              translatedClassName="text-muted"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted lg:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent sm:flex"
            >
              <span aria-hidden>✉️</span>
              <span className="hidden lg:inline">{tFooter("contactTitle")}</span>
            </Link>
            <LanguageSwitcher />
            <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />

            {session?.user ? (
              <div className="flex items-center gap-3">
                <NextLink
                  href="/dashboard"
                  className="hidden text-sm text-muted lg:block"
                  title={session.user.email ?? undefined}
                >
                  {displayName} · {roleLabel(session.user.role, locale)}
                </NextLink>
                <NextLink
                  href="/dashboard"
                  className="whitespace-nowrap rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
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
                    className="hidden rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-accent hover:text-accent sm:block"
                  >
                    {t("logout")}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="whitespace-nowrap rounded-lg border border-navy/25 px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-navy-foreground"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="whitespace-nowrap rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
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
