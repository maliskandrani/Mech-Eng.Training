import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [courseCount, publishedCount, trainerCount, studentCount, enrollmentCount] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "TRAINER"] } } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.enrollment.count(),
  ]);

  const stats = [
    { label: "الدورات", value: courseCount, href: "/dashboard/admin/courses" },
    { label: "الدورات المنشورة", value: publishedCount, href: "/dashboard/admin/courses" },
    { label: "المدربون", value: trainerCount, href: "/dashboard/admin/trainers" },
    { label: "المتدربون", value: studentCount, href: "/dashboard/admin/students" },
    { label: "التسجيلات", value: enrollmentCount, href: "/dashboard/admin/students" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">نظرة عامة</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
          >
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-accent">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
