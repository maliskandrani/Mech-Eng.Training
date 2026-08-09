import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth, signOut } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/utils";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";

export default async function Header() {
  const [session, t, tBrand] = await Promise.all([
    auth(),
    getTranslations("nav"),
    getTranslations("brand"),
  ]);

  const NAV_LINKS = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/trainers", label: t("trainers") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-accent-foreground font-bold">
            م
          </span>
          <span className="hidden text-sm font-bold text-foreground sm:block sm:text-base">
            {tBrand("line1")} <span className="text-accent">{tBrand("line2")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

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
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent"
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
    </header>
  );
}
