import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { ROLE_LABELS } from "@/lib/utils";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="dash-theme flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border bg-background-card px-4 py-3 shadow-sm sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient text-accent-foreground font-bold">
            م
          </span>
          <span className="text-sm font-bold text-foreground">لوحة التحكم</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">
            {session.user.name} · {ROLE_LABELS[session.user.role]}
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
  );
}
