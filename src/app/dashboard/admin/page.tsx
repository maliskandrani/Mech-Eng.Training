import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getRevenueByCourse } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import BarChart from "@/components/site/BarChart";

export default async function AdminOverviewPage() {
  const [courseCount, publishedCount, trainerCount, studentCount, enrollmentCount, settings, revenueByCourse] =
    await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.user.count({ where: { role: { in: ["ADMIN", "TRAINER"] } } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.enrollment.count(),
      getSiteSettings(),
      getRevenueByCourse(),
    ]);
  const currency = settings?.currency ?? "LYD";
  const totalRevenue = revenueByCourse.reduce((n, c) => n + c.revenue, 0);
  const revenueChartData = revenueByCourse.map((c) => ({ label: c.title, value: c.revenue }));

  const stats = [
    {
      label: "الدورات",
      value: courseCount,
      icon: "📚",
      color: "kpi-pink",
      href: "/dashboard/admin/courses",
      sub: [
        { label: "منشورة", value: publishedCount },
        { label: "مسودة", value: courseCount - publishedCount },
      ],
    },
    { label: "الدورات المنشورة", value: publishedCount, icon: "✅", color: "kpi-green", href: "/dashboard/admin/courses" },
    { label: "المدربون", value: trainerCount, icon: "🧑‍🏫", color: "kpi-yellow", href: "/dashboard/admin/trainers" },
    { label: "المتدربون", value: studentCount, icon: "🎓", color: "kpi-blue", href: "/dashboard/admin/students" },
    { label: "التسجيلات", value: enrollmentCount, icon: "📝", color: "kpi-purple", href: "/dashboard/admin/students" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">لوحة التحكم</h1>
      <p className="mt-1 text-sm text-muted">هذه الإحصائيات مرئية للمدير فقط.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s, i) =>
          i === 0 ? (
            <Link
              key={s.label}
              href={s.href}
              className="gold-gradient rounded-2xl p-5 text-accent-foreground transition hover:opacity-90"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold">{s.label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/50 text-sm">{s.icon}</span>
              </div>
              <p className="mt-3 text-3xl font-extrabold">{s.value}</p>
              {s.sub && (
                <div className="mt-3 flex justify-between text-xs">
                  {s.sub.map((item) => (
                    <div key={item.label}>
                      {item.label}
                      <b className="mt-0.5 block text-sm">{item.value}</b>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ) : (
            <Link key={s.label} href={s.href} className={`kpi rounded-2xl p-5 transition hover:opacity-90 ${s.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold">{s.label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">{s.icon}</span>
              </div>
              <p className="mt-3 text-3xl font-extrabold">{s.value}</p>
              {s.sub && (
                <div className="mt-3 flex justify-between text-xs">
                  {s.sub.map((item) => (
                    <div key={item.label}>
                      {item.label}
                      <b className="mt-0.5 block text-sm">{item.value}</b>
                    </div>
                  ))}
                </div>
              )}
            </Link>
          )
        )}
      </div>

      {revenueChartData.length > 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-background-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">الإيرادات المقدَّرة حسب الدورة</h2>
            <span className="text-lg font-extrabold text-accent">{formatPrice(totalRevenue, currency)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            تقدير مبني على (سعر الدورة × عدد المتدربين المسجَّلين) — مرئي للمدير فقط.
          </p>
          <div className="mt-5">
            <BarChart data={revenueChartData} valueFormatter={(v) => formatPrice(v, currency)} />
          </div>
        </div>
      )}
    </div>
  );
}
