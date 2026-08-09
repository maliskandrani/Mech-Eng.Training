"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: string };

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  ADMIN: [
    { href: "/dashboard/admin", label: "نظرة عامة", icon: "📊" },
    { href: "/dashboard/admin/courses", label: "الدورات", icon: "📚" },
    { href: "/dashboard/admin/trainers", label: "المدربون", icon: "🧑‍🏫" },
    { href: "/dashboard/admin/students", label: "المتدربون", icon: "🎓" },
  ],
  TRAINER: [
    { href: "/dashboard/trainer", label: "دوراتي", icon: "📚" },
    { href: "/dashboard/trainer/profile", label: "الملف الشخصي", icon: "🧑‍🏫" },
  ],
  STUDENT: [{ href: "/dashboard/student", label: "دوراتي", icon: "🎓" }],
};

export default function Sidebar({ role }: { role: "ADMIN" | "TRAINER" | "STUDENT" }) {
  const items = NAV_BY_ROLE[role] ?? [];
  const pathname = usePathname();

  return (
    <aside className="sidebar-green w-full shrink-0 text-white md:w-64 md:min-h-[calc(100vh-61px)]">
      <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col md:overflow-visible">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${
                active ? "bg-white/25" : "hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
        >
          <span>🏠</span>
          <span>الموقع الرئيسي</span>
        </Link>
      </nav>
    </aside>
  );
}
