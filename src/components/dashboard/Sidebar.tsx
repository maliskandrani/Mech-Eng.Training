import Link from "next/link";

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

  return (
    <aside className="w-full shrink-0 border-b border-border bg-background-elevated md:w-64 md:border-b-0 md:border-l md:min-h-[calc(100vh-57px)]">
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-background-card hover:text-accent-soft"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        <Link
          href="/"
          className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-background-card hover:text-accent-soft"
        >
          <span>🏠</span>
          <span>الموقع الرئيسي</span>
        </Link>
      </nav>
    </aside>
  );
}
