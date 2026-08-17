"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/site/Logo";

type NavItem = { href: string; label: string; icon: string };

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "نظرة عامة", icon: "📊" },
    { href: "/dashboard/admin/courses", label: "الدورات", icon: "📚" },
    { href: "/dashboard/admin/trainers", label: "المدربون", icon: "🧑‍🏫" },
    { href: "/dashboard/admin/students", label: "المتدربون", icon: "🎓" },
    { href: "/dashboard/admin/messages", label: "الرسائل", icon: "✉️" },
    { href: "/dashboard/admin/profile", label: "الملف الشخصي", icon: "🧑‍💼" },
    { href: "/dashboard/admin/settings", label: "إعدادات الموقع", icon: "⚙️" },
  ],
  TRAINER: [
    { href: "/dashboard/trainer", label: "دوراتي", icon: "📚" },
    { href: "/dashboard/trainer/profile", label: "الملف الشخصي", icon: "🧑‍🏫" },
  ],
  STUDENT: [{ href: "/dashboard/student", label: "دوراتي", icon: "🎓" }],
};

export default function Sidebar({
  role,
  logoUrl,
  unreadMessages = 0,
}: {
  role: "ADMIN" | "TRAINER" | "STUDENT";
  logoUrl?: string | null;
  unreadMessages?: number;
}) {
  const items = NAV_BY_ROLE[role] ?? [];
  const pathname = usePathname();

  return (
    <aside className="sidebar-green w-full shrink-0 text-navy-foreground md:w-64 md:min-h-[calc(100vh-61px)]">
      <Link
        href="/"
        title="العودة إلى الموقع الرئيسي"
        className="hidden items-center gap-3 border-b border-white/10 px-5 py-6 transition hover:bg-white/5 md:flex"
      >
        <Logo logoUrl={logoUrl} size={130} />
        <div className="text-xs leading-5">
          <p className="font-extrabold tracking-wide text-navy-foreground">SkillStream</p>
          <p className="text-navy-muted">Academy</p>
        </div>
      </Link>

      <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col md:overflow-visible">
        {items.map((item) => {
          const active = pathname === item.href;
          const badge = item.href === "/dashboard/admin/messages" ? unreadMessages : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-3.5 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-accent/30 bg-accent/15 text-accent-soft"
                  : "border-transparent text-navy-muted hover:bg-white/5 hover:text-navy-foreground"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {badge > 0 && (
                <span className="me-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-transparent px-3.5 py-2.5 text-sm font-semibold text-navy-muted transition hover:bg-white/5 hover:text-navy-foreground"
        >
          <span>🏠</span>
          <span>الموقع الرئيسي</span>
        </Link>
      </nav>
    </aside>
  );
}
