import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedHref } from "@/i18n/routing";
import { searchPublishedCourses, getCategories, getSiteSettings } from "@/lib/queries";
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
  const [{ items: courses, totalPages }, categories, settings, locale, t] = await Promise.all([
    searchPublishedCourses({ q, categorySlug: category, page }),
    getCategories(),
    getSiteSettings(),
    getLocale(),
    getTranslations("courses"),
  ]);
  const currency = settings?.currency ?? "LYD";

  function categoryHref(slug?: string) {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q) params.set("q", q);
    const qs = params.toString();
    return localizedHref(locale, qs ? `/courses?${qs}` : "/courses");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground">{t("pageTitle")}</h1>
      <p className="mt-2 text-muted">{t("pageSubtitle")}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={categoryHref(undefined)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !category
                ? "border-navy bg-navy text-navy-foreground"
                : "border-border text-muted hover:border-navy/40 hover:text-navy"
            }`}
          >
            {t("all")}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat.slug)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === cat.slug
                  ? "border-navy bg-navy text-navy-foreground"
                  : "border-border text-muted hover:border-navy/40 hover:text-navy"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <Suspense>
          <SearchInput placeholder={t("searchPlaceholder")} />
        </Suspense>
      </div>

      {courses.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} currency={currency} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted">{t("noResults")}</p>
      )}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        prevLabel={t("prev")}
        nextLabel={t("next")}
        buildHref={(p) =>
          localizedHref(
            locale,
            `/courses?${new URLSearchParams({
              ...(category ? { category } : {}),
              ...(q ? { q } : {}),
              page: String(p),
            }).toString()}`
          )
        }
      />
    </div>
  );
}
