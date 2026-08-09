import Link from "next/link";
import Image from "next/image";
import { formatPrice, LEVEL_LABELS } from "@/lib/utils";

type CourseCardData = {
  slug: string;
  title: string;
  subtitle: string | null;
  posterUrl: string | null;
  price: number;
  level: string;
  trainer: { name: string };
  category: { name: string } | null;
  _count?: { enrollments: number; modules?: number };
};

export default function CourseCard({ course }: { course: CourseCardData }) {
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
            <span className="text-sm">لا توجد صورة غلاف بعد</span>
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
            {LEVEL_LABELS[course.level] ?? course.level}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-bold text-accent">{formatPrice(course.price)}</span>
          {typeof course._count?.enrollments === "number" && (
            <span className="text-xs text-muted">{course._count.enrollments} متدرب</span>
          )}
        </div>
      </div>
    </Link>
  );
}
