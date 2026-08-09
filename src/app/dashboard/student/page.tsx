import Link from "next/link";
import { auth } from "@/lib/auth";
import { getStudentEnrollments } from "@/lib/queries";
import { arabicCount } from "@/lib/utils";

export default async function StudentOverviewPage() {
  const session = await auth();
  const enrollments = await getStudentEnrollments(session!.user.id);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">دوراتي</h1>

      {enrollments.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enr) => {
            const lessons = enr.course.sections.flatMap((s) => s.lessons);
            const totalMaterials = lessons.reduce((n, l) => n + l.materials.length, 0);
            return (
              <Link
                key={enr.id}
                href={`/dashboard/student/courses/${enr.course.id}`}
                className="rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
              >
                <h3 className="font-bold text-foreground">{enr.course.title}</h3>
                <p className="mt-1 text-sm text-muted">{enr.course.trainer.name}</p>
                <p className="mt-3 text-xs text-accent-soft">
                  {arabicCount(lessons.length, "درس", "درسان", "دروس")} ·{" "}
                  {arabicCount(totalMaterials, "ملف", "ملفان", "ملفات")}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-background-card p-6 text-muted">
          لم تلتحق بأي دورة بعد.{" "}
          <Link href="/courses" className="text-accent hover:underline">
            استعرض الدورات المتاحة
          </Link>
          .
        </div>
      )}
    </div>
  );
}
