import Image from "next/image";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { localizedTitle } from "@/lib/utils";
import StarRating from "@/components/site/StarRating";

type CourseCardData = {
  slug: string;
  title: string;
  titleEn: string | null;
  subtitle: string | null;
  subtitleEn: string | null;
  posterUrl: string | null;
  price: number;
  totalHours: number | null;
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
  comingSoon = false,
}: {
  course: CourseCardData;
  currency?: string;
  comingSoon?: boolean;
}) {
  const t = useTranslations("courses");
  const format = useFormatter();
  const locale = useLocale();
  const lessonsCount = course.sections.reduce((n, s) => n + s._count.lessons, 0);
  const computedMinutes = course.sections.reduce(
    (n, s) =>
      n + s.lessons.reduce((m, l) => m + l.materials.reduce((k, mat) => k + (mat.durationMinutes ?? 0), 0), 0),
    0
  );
  const totalHours = course.totalHours ?? computedMinutes / 60;
  const title = localizedTitle(course.title, course.titleEn, locale);
  const subtitle = course.subtitle ? localizedTitle(course.subtitle, course.subtitleEn, locale) : null;
  const featured = course.order === 1;
  const reviewCount = course.reviews.length;
  const avgRating = reviewCount > 0 ? course.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount : 0;

  const cardClassName = `group flex flex-col overflow-hidden rounded-2xl border border-border bg-background-card shadow-sm transition ${
    comingSoon ? "opacity-80" : "hover:-translate-y-1 hover:shadow-lg"
  }`;

  const content = (
    <>
      {(featured || course.category || comingSoon) && (
        <div className="flex items-center justify-between gap-2 px-4 pt-4">
          {comingSoon ? (
            <span className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted">
              🕒 {t("comingSoon")}
            </span>
          ) : featured ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow">
              {t("featured")}
            </span>
          ) : (
            <span />
          )}
          {course.category && (
            <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-navy-foreground">
              {course.category.name}
            </span>
          )}
        </div>
      )}

      <div className="relative mt-3 h-48 w-full overflow-hidden bg-background-elevated sm:h-52">
        {course.posterUrl ? (
          <Image
            src={course.posterUrl}
            alt={title}
            fill
            className={`object-contain p-2 transition duration-300 ${comingSoon ? "grayscale" : "group-hover:scale-105"}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <span className="text-sm">{t("noPoster")}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold text-accent-soft">
          {t(`level.${course.level}` as "level.BEGINNER")}
        </span>
        <h3 className="text-lg font-bold text-foreground line-clamp-2">{title}</h3>
        {subtitle && <p className="text-sm text-muted line-clamp-2">{subtitle}</p>}
        <p className="text-xs text-muted">{course.trainer.name}</p>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-accent">{avgRating.toFixed(1)}</span>
            <StarRating rating={avgRating} size="sm" />
            <span className="text-muted">({reviewCount})</span>
          </div>
        )}

        {!comingSoon && (
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1">📖 {t("lessonsCount", { count: lessonsCount })}</span>
            {totalHours > 0 && (
              <span className="flex items-center gap-1">⏱️ {totalHours.toFixed(1)} {t("hoursShort")}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          {comingSoon ? (
            <span className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted">
              🕒 {t("comingSoon")}
            </span>
          ) : (
            <>
              <span className="font-bold text-accent">
                {course.price > 0 ? format.number(course.price, { style: "currency", currency }) : t("free")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-navy-foreground transition group-hover:bg-navy-soft">
                {t("viewDetails")}
                <span aria-hidden>←</span>
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  if (comingSoon) {
    return (
      <div className={cardClassName} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/courses/${course.slug}`} className={cardClassName}>
      {content}
    </Link>
  );
}
