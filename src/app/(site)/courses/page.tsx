import Link from "next/link";
import { Suspense } from "react";
import { searchPublishedCourses, getCategories } from "@/lib/queries";
import CourseCard from "@/components/site/CourseCard";
import SearchInput from "@/components/ui/SearchInput";
import PaginationBar from "@/components/ui/PaginationBar";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [{ items: courses, totalPages }, categories] = await Promise.all([
    searchPublishedCourses({ q, categorySlug: category, page }),
    getCategories(),
  ]);

  function categoryHref(slug?: string) {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/courses?${qs}` : "/courses";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground">الدورات التدريبية</h1>
      <p className="mt-2 text-muted">اختر التصنيف الذي يهمك، أو ابحث عن دورة معيّنة.</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={categoryHref(undefined)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              !category ? "border-accent bg-accent/10 text-accent-soft" : "border-border text-muted hover:border-accent/60"
            }`}
          >
            الكل
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat.slug)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                category === cat.slug
                  ? "border-accent bg-accent/10 text-accent-soft"
                  : "border-border text-muted hover:border-accent/60"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <Suspense>
          <SearchInput placeholder="ابحث عن دورة..." />
        </Suspense>
      </div>

      {courses.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted">لا توجد دورات مطابقة حاليًا.</p>
      )}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        buildHref={(p) =>
          `/courses?${new URLSearchParams({
            ...(category ? { category } : {}),
            ...(q ? { q } : {}),
            page: String(p),
          }).toString()}`
        }
      />
    </div>
  );
}
