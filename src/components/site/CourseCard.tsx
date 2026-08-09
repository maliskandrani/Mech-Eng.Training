import Image from "next/image";
import { useTranslations, useFormatter } from "next-intl";
import { Link } from "@/i18n/navigation";

type CourseCardData = {
  slug: string;
  title: string;
  subtitle: string | null;
  posterUrl: string | null;
  price: number;
  level: string;
  trainer: { name: string };
  category: { name: string } | null;
};

export default function CourseCard({ course }: { course: CourseCardData }) {
  const t = useTranslations("courses");
  const format = useFormatter();

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background-card transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-background-elevated">
        {course.posterUrl ? (
          <Image
            src={course.posterUrl}
            alt={course.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <span className="text-sm">{t("noPoster")}</span>
          </div>
        )}
        {course.category && (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-accent-soft backdrop-blur">
            {course.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold text-foreground line-clamp-2">{course.title}</h3>
        {course.subtitle && (
          <p className="text-sm text-muted line-clamp-2">{course.subtitle}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="text-muted">{course.trainer.name}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
            {t(`level.${course.level}` as "level.BEGINNER")}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <span className="font-bold text-accent">
            {course.price > 0 ? format.number(course.price, { style: "currency", currency: "SAR" }) : t("free")}
          </span>
        </div>
      </div>
    </Link>
  );
}
