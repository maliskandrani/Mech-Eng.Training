import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getStudentEnrollments } from "@/lib/queries";
import { arabicCount, formatDuration, LEVEL_LABELS } from "@/lib/utils";
import StarRating from "@/components/site/StarRating";

export default async function StudentOverviewPage() {
  const session = await auth();
  const enrollments = await getStudentEnrollments(session!.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">دوراتي</h1>
        <Link
          href="/courses"
          className="rounded-xl gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90"
        >
          + استعرض الدورات المتاحة
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted">
        {arabicCount(enrollments.length, "دورة مسجَّلة", "دورتان مسجَّلتان", "دورات مسجَّلة")}
      </p>

      {enrollments.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enr) => {
            const { course } = enr;
            const lessons = course.sections.flatMap((s) => s.lessons);
            const materials = lessons.flatMap((l) => l.materials);
            const computedMinutes = materials.reduce((n, m) => n + (m.durationMinutes ?? 0), 0);
            const totalMinutes = course.totalHours != null ? course.totalHours * 60 : computedMinutes;
            const duration = formatDuration(totalMinutes);
            const reviewCount = course.reviews.length;
            const avgRating =
              reviewCount > 0 ? course.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount : 0;
            const enrolledOn = new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(enr.enrolledAt);

            return (
              <Link
                key={enr.id}
                href={`/dashboard/student/courses/${course.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-sm transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg"
              >
                <div className="relative h-36 w-full overflow-hidden bg-background-elevated">
                  {course.posterUrl ? (
                    <Image
                      src={course.posterUrl}
                      alt={course.title}
                      fill
                      className="object-contain p-2 transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl text-muted">🎓</div>
                  )}
                  {course.category && (
                    <span className="absolute end-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-semibold text-navy-foreground backdrop-blur">
                      {course.category.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-xs font-semibold text-accent-soft">{LEVEL_LABELS[course.level]}</span>
                  <h3 className="font-bold text-foreground line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-muted">المدرب: {course.trainer.name}</p>

                  {reviewCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-accent">{avgRating.toFixed(1)}</span>
                      <StarRating rating={avgRating} size="sm" />
                      <span className="text-muted">({reviewCount})</span>
                    </div>
                  )}

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1">📖 {arabicCount(lessons.length, "درس", "درسان", "دروس")}</span>
                    {duration && <span className="flex items-center gap-1">⏱️ {duration}</span>}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted">التحقت في {enrolledOn}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-navy-foreground transition group-hover:bg-navy-soft">
                      متابعة التعلم
                      <span aria-hidden>←</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-background-card p-8 text-center text-muted">
          <p className="text-3xl">🎓</p>
          <p className="mt-3">لم تلتحق بأي دورة بعد.</p>
          <Link
            href="/courses"
            className="mt-4 inline-block rounded-xl gold-gradient px-5 py-2.5 text-sm font-bold text-accent-foreground transition hover:opacity-90"
          >
            استعرض الدورات المتاحة
          </Link>
        </div>
      )}
    </div>
  );
}
