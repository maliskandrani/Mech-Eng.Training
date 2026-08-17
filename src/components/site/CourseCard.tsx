import Image from "next/image";
import { useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";
import StarRating from "@/components/site/StarRating";

type CourseCardData = {
  slug: string;
  title: string;
  subtitle: string | null;
  posterUrl: string | null;
  price: number;
  level: string;
  order: number;
  trainer: { name: string };
  category: { name: string } | null;
  _count: { sections: number };
  sections: { _count: { lessons: number }; lessons: { materials: { durationMinutes: number | null }[] }[] }[];
  reviews: { rating: number }[];
};

export default function CourseCard({
  course,
  currency = "LYD",
}: {
  course: CourseCardData;
  currency?: string;
}) {
  const t = useTranslations("courses");
  const format = useFormatter();
  const lessonsCount = course.sections.reduce((n, s) => n + s._count.lessons, 0);
  const totalMinutes = course.sections.reduce(
    (n, s) =>
      n + s.lessons.reduce((m, l) => m + l.materials.reduce((k, mat) => k + (mat.durationMinutes ?? 0), 0), 0),
    0
  );
  const totalHours = totalMinutes / 60;
  const featured = course.order === 1;
  const reviewCount = course.reviews.length;
  const avgRating = reviewCount > 0 ? course.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount : 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden bg-background-elevated">
        {course.posterUrl ? (
          <Image
            src={course.posterUrl}
            alt={course.title}
            fill
            className="object-contain p-2 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <span className="text-sm">{t("noPoster")}</span>
          </div>
        )}
        {featured && (
          <span className="absolute start-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
            {t("featured")}
          </span>
        )}
        {course.category && (
          <span className="absolute end-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-semibold text-navy-foreground backdrop-blur">
            {course.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold text-accent-soft">
          {t(`level.${course.level}` as "level.BEGINNER")}
        </span>
        <h3 className="text-lg font-bold text-foreground line-clamp-2">{course.title}</h3>
        {course.subtitle && <p className="text-sm text-muted line-clamp-2">{course.subtitle}</p>}
        <p className="text-xs text-muted">{course.trainer.name}</p>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-accent">{avgRating.toFixed(1)}</span>
            <StarRating rating={avgRating} size="sm" />
            <span className="text-muted">({reviewCount})</span>
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1">📖 {t("lessonsCount", { count: lessonsCount })}</span>
          {totalHours > 0 && (
            <span className="flex items-center gap-1">⏱️ {totalHours.toFixed(1)} {t("hoursShort")}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="font-bold text-accent">
            {course.price > 0 ? format.number(course.price, { style: "currency", currency }) : t("free")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-navy-foreground transition group-hover:bg-navy-soft">
            {t("viewDetails")}
            <span aria-hidden>←</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
