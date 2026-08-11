import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cairo } from "next/font/google";
import { auth, signOut } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { ROLE_LABELS } from "@/lib/utils";
import "../globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم | أكاديمية الهندسة الميكانيكية وهندسة الأنابيب",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="dash-theme flex min-h-screen flex-col bg-background text-foreground">
          <header className="flex items-center justify-between border-b border-border bg-background-card px-4 py-3 shadow-sm sm:px-6">
            <Link href="/" className="text-sm font-bold text-foreground">
              لوحة التحكم
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden text-muted sm:inline">
                {session.user.name} · {ROLE_LABELS[session.user.role]}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-sm font-bold text-accent-foreground">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt={session.user.name ?? ""} className="h-full w-full object-cover" />
                ) : (
                  session.user.name?.charAt(0) ?? "؟"
                )}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-muted transition hover:border-accent hover:text-accent">
                  تسجيل الخروج
                </button>
              </form>
            </div>
          </header>

          <div className="flex flex-1 flex-col md:flex-row">
            <Sidebar role={session.user.role} />
            <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
