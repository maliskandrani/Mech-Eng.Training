import Link from "next/link";
import { auth } from "@/lib/auth";
import { getCoursesForTrainer } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export default async function TrainerOverviewPage() {
  const session = await auth();
  const courses = await getCoursesForTrainer(session!.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">دوراتي</h1>
        <Link
          href="/dashboard/trainer/courses/new"
          className="rounded-xl gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90"
        >
          + دورة جديدة
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/trainer/courses/${course.id}`}
              className="rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">{course.title}</h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    course.published ? "border-green-400/30 text-green-300" : "border-border text-muted"
                  }`}
                >
                  {course.published ? "منشورة" : "مسودة"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{course.category?.name ?? "بدون تصنيف"}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-accent">{formatPrice(course.price)}</span>
                <span className="text-muted">{course._count.enrollments} متدرب</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">لا توجد لديك دورات بعد.</p>
      )}
    </div>
  );
}
