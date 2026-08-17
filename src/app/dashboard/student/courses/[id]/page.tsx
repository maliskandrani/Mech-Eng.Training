import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { arabicCount, formatDuration, LEVEL_LABELS } from "@/lib/utils";
import VideoEmbed from "@/components/site/VideoEmbed";
import StarRating from "@/components/site/StarRating";
import StudentCourseAccordion from "@/components/dashboard/StudentCourseAccordion";

export default async function StudentCourseViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session!.user.id, courseId: id } },
    include: {
      course: {
        include: {
          trainer: true,
          category: true,
          reviews: { select: { rating: true } },
          sections: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: { materials: { orderBy: { order: "asc" } } },
              },
            },
          },
        },
      },
    },
  });
  if (!enrollment) notFound();

  const { course } = enrollment;
  const lessons = course.sections.flatMap((s) => s.lessons);
  const materials = lessons.flatMap((l) => l.materials);
  const computedMinutes = materials.reduce((n, m) => n + (m.durationMinutes ?? 0), 0);
  const totalMinutes = course.totalHours != null ? course.totalHours * 60 : computedMinutes;
  const duration = formatDuration(totalMinutes);
  const reviewCount = course.reviews.length;
  const avgRating = reviewCount > 0 ? course.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount : 0;

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/dashboard/student" className="text-sm font-semibold text-accent-soft hover:underline">
        ← دوراتي
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
        {course.category && <span className="text-accent-soft">{course.category.name}</span>}
        {course.category && <span>·</span>}
        <span>{LEVEL_LABELS[course.level]}</span>
        {reviewCount > 0 && (
          <>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <StarRating rating={avgRating} size="sm" />
              <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>
              <span>({arabicCount(reviewCount, "تقييم", "تقييمان", "تقييمات")})</span>
            </span>
          </>
        )}
      </div>

      <h1 className="mt-2 text-2xl font-extrabold text-foreground">{course.title}</h1>
      {course.subtitle && <p className="mt-2 text-muted">{course.subtitle}</p>}

      <div className="mt-5 aspect-video max-h-[46vh] overflow-hidden rounded-2xl border border-border bg-background-card sm:max-h-[52vh]">
        {course.introVideoUrl ? (
          <VideoEmbed url={course.introVideoUrl} />
        ) : course.posterUrl ? (
          <div className="relative h-full w-full">
            <Image src={course.posterUrl} alt={course.title} fill className="object-contain object-top p-2" />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-muted">🎓</div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background-card p-4 text-center">
          <p className="text-xl">📚</p>
          <p className="mt-1 font-bold text-foreground">{course.sections.length}</p>
          <p className="text-xs text-muted">قسم</p>
        </div>
        <div className="rounded-2xl border border-border bg-background-card p-4 text-center">
          <p className="text-xl">📖</p>
          <p className="mt-1 font-bold text-foreground">{lessons.length}</p>
          <p className="text-xs text-muted">درس</p>
        </div>
        <div className="rounded-2xl border border-border bg-background-card p-4 text-center">
          <p className="text-xl">⏱️</p>
          <p className="mt-1 font-bold text-foreground">{duration ?? "—"}</p>
          <p className="text-xs text-muted">إجمالي المدة</p>
        </div>
      </div>

      <Link
        href={`/trainers/${course.trainer.id}`}
        className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-lg font-bold text-accent-foreground">
          {course.trainer.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.trainer.avatarUrl}
              alt={course.trainer.name}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            course.trainer.name.charAt(0)
          )}
        </div>
        <div>
          <p className="text-xs text-muted">المدرب</p>
          <h3 className="font-bold text-foreground">{course.trainer.name}</h3>
          {course.trainer.title && <p className="text-sm text-muted">{course.trainer.title}</p>}
        </div>
      </Link>

      {course.description && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-foreground">عن الدورة</h2>
          <p className="mt-3 whitespace-pre-line leading-8 text-muted">{course.description}</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-bold text-foreground">محتوى الدورة</h2>
        <div className="mt-4">
          <StudentCourseAccordion sections={course.sections} />
        </div>
      </div>
    </div>
  );
}
