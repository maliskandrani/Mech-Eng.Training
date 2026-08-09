import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "الدورات التدريبية" },
  { href: "/trainers", label: "المدربون" },
];

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg gold-gradient text-accent-foreground font-bold">
            م
          </span>
          <span className="text-sm font-bold text-foreground sm:text-base">
            أكاديمية الهندسة الميكانيكية <span className="text-accent">وهندسة الأنابيب</span>
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
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden text-sm text-muted sm:block"
                title={session.user.email ?? undefined}
              >
                {session.user.name} · {ROLE_LABELS[session.user.role]}
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                لوحة التحكم
              </Link>
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
                  تسجيل الخروج
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
