import Link from "next/link";
import { getAllCoursesForAdmin } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { setCoursePublished, deleteCourse } from "@/lib/actions/course-actions";
import { PublishToggle, ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">الدورات</h1>
        <Link
          href="/dashboard/admin/courses/new"
          className="rounded-xl gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90"
        >
          + دورة جديدة
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-background-elevated text-muted">
            <tr>
              <th className="p-3 text-right">العنوان</th>
              <th className="p-3 text-right">المدرب</th>
              <th className="p-3 text-right">السعر</th>
              <th className="p-3 text-right">المتدربون</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course) => (
              <tr key={course.id} className="bg-background-card">
                <td className="p-3 font-medium text-foreground">{course.title}</td>
                <td className="p-3 text-muted">{course.trainer.name}</td>
                <td className="p-3 text-muted">{formatPrice(course.price)}</td>
                <td className="p-3 text-muted">{course._count.enrollments}</td>
                <td className="p-3">
                  <PublishToggle courseId={course.id} published={course.published} action={setCoursePublished} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/admin/courses/${course.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent"
                    >
                      إدارة
                    </Link>
                    <Link
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent"
                    >
                      عرض
                    </Link>
                    <ConfirmDeleteButton onConfirm={deleteCourse.bind(null, course.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
