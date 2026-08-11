import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { searchCoursesForAdmin, getSiteSettings } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { setCoursePublished, deleteCourse } from "@/lib/actions/course-actions";
import { PublishToggle, ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import SearchInput from "@/components/ui/SearchInput";
import PaginationBar from "@/components/ui/PaginationBar";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [{ items: courses, totalPages }, settings] = await Promise.all([
    searchCoursesForAdmin({ q, page }),
    getSiteSettings(),
  ]);
  const currency = settings?.currency ?? "LYD";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-foreground">الدورات</h1>
        <div className="flex items-center gap-3">
          <Suspense>
            <SearchInput placeholder="ابحث بعنوان الدورة..." />
          </Suspense>
          <Link
            href="/dashboard/admin/courses/new"
            className="whitespace-nowrap rounded-xl gold-gradient px-4 py-2 text-sm font-bold text-accent-foreground transition hover:opacity-90"
          >
            + دورة جديدة
          </Link>
        </div>
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
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-video h-11 shrink-0 overflow-hidden rounded-lg bg-background-elevated">
                      {course.posterUrl ? (
                        <Image src={course.posterUrl} alt={course.title} fill className="object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg">📚</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{course.title}</p>
                      {course.category && (
                        <span className="mt-1 inline-block rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-normal text-accent-soft">
                          {course.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted">{course.trainer.name}</td>
                <td className="p-3 text-muted">{formatPrice(course.price, currency)}</td>
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
            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  لا توجد نتائج مطابقة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/dashboard/admin/courses?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) }).toString()}`}
      />
    </div>
  );
}
