import Link from "next/link";
import { getPublishedCourses, getCategories } from "@/lib/queries";
import CourseCard from "@/components/site/CourseCard";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [courses, categories] = await Promise.all([getPublishedCourses(), getCategories()]);

  const filtered = category
    ? courses.filter((c) => c.category?.slug === category)
    : courses;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground">الدورات التدريبية</h1>
      <p className="mt-2 text-muted">اختر التصنيف الذي يهمك، أو استعرض جميع الدورات المتاحة.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !category ? "border-accent bg-accent/10 text-accent-soft" : "border-border text-muted hover:border-accent/60"
          }`}
        >
          الكل
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/courses?category=${cat.slug}`}
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

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted">لا توجد دورات في هذا التصنيف حاليًا.</p>
      )}
    </div>
  );
}
