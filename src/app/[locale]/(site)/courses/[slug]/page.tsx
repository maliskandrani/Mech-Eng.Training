import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedHref } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getCourseBySlug, getSiteSettings, getMyEnrollment } from "@/lib/queries";
import { submitReview } from "@/lib/actions/review-actions";
import { formatDuration, localizedTitle } from "@/lib/utils";
import VideoEmbed from "@/components/site/VideoEmbed";
import EnrollButton from "@/components/site/EnrollButton";
import StarRating from "@/components/site/StarRating";
import ReviewForm from "@/components/site/ReviewForm";
import CourseContentAccordion from "@/components/site/CourseContentAccordion";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, settings, session, locale, t, tTrainers, format] = await Promise.all([
    getCourseBySlug(slug),
    getSiteSettings(),
    auth(),
    getLocale(),
    getTranslations("courses"),
    getTranslations("trainers"),
    getFormatter(),
  ]);
  const currency = settings?.currency ?? "LYD";

  if (!course) notFound();

  const canPreviewDraft =
    session?.user?.role === "ADMIN" || session?.user?.id === course.trainerId;
  if (!course.published && !canPreviewDraft) notFound();

  const isStudent = session?.user?.role === "STUDENT";
  const lessons = course.sections.flatMap((s) => s.lessons);
  const computedMinutes = lessons.reduce(
    (n, l) => n + l.materials.reduce((m, mat) => m + (mat.durationMinutes ?? 0), 0),
    0
  );
  const totalMinutes = course.totalHours != null ? course.totalHours * 60 : computedMinutes;
  const totalDuration = formatDuration(totalMinutes, locale);
  const title = localizedTitle(course.title, course.titleEn, locale);
  const subtitle = course.subtitle ? localizedTitle(course.subtitle, course.subtitleEn, locale) : null;
  const loginHref = `${localizedHref(locale, "/login")}?callbackUrl=${encodeURIComponent(
    localizedHref(locale, `/courses/${course.slug}`)
  )}`;

  const reviewCount = course.reviews.length;
  const avgRating = reviewCount > 0 ? course.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount : 0;
  const myEnrollment =
    isStudent && session?.user ? await getMyEnrollment(session.user.id, course.id) : null;
  const myReview = session?.user ? course.reviews.find((r) => r.userId === session.user!.id) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8">
      {!course.published && (
        <div className="mb-6 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
          {t("draftNotice")}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {course.category && <span className="text-accent-soft">{course.category.name}</span>}
            <span>·</span>
            <span>{t(`level.${course.level}` as "level.BEGINNER")}</span>
            {reviewCount > 0 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <StarRating rating={avgRating} size="sm" />
                  <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>
                  <span>({t("reviewsCount", { count: reviewCount })})</span>
                </span>
              </>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-muted sm:text-lg">{subtitle}</p>}

          <div className="mt-4 aspect-video max-h-[46vh] overflow-hidden rounded-2xl border border-border bg-background-card sm:max-h-[52vh]">
            {course.introVideoUrl ? (
              <VideoEmbed url={course.introVideoUrl} />
            ) : course.posterUrl ? (
              <div className="relative h-full w-full">
                <Image src={course.posterUrl} alt={title} fill className="object-contain object-top p-2" />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted">{t("noVideoOrPoster")}</div>
            )}
          </div>

          {course.description && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground">{t("aboutTitle")}</h2>
              <p className="mt-3 whitespace-pre-line leading-8 text-muted">{course.description}</p>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground">{t("contentTitle")}</h2>
            <p className="mt-1 text-sm text-muted">
              {t("sectionsCount", { count: course.sections.length })} ·{" "}
              {t("lessonsCount", { count: lessons.length })}
              {totalDuration ? ` · ${totalDuration}` : ""}
            </p>
            <div className="mt-4">
              <CourseContentAccordion sections={course.sections} locale={locale} />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground">{t("reviewsTitle")}</h2>

            <div className="mt-4">
              {isStudent && myEnrollment ? (
                <ReviewForm
                  action={submitReview.bind(null, course.id)}
                  initialRating={myReview?.rating ?? 0}
                  initialComment={myReview?.comment ?? ""}
                />
              ) : isStudent ? (
                <p className="rounded-xl border border-border bg-background-card p-4 text-sm text-muted">
                  {t("enrollToReview")}
                </p>
              ) : !session?.user ? (
                <NextLink
                  href={loginHref}
                  className="block rounded-xl border border-border bg-background-card p-4 text-sm font-semibold text-accent-soft transition hover:border-accent"
                >
                  {t("loginToReview")}
                </NextLink>
              ) : null}
            </div>

            {course.reviews.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                <span className="text-xl text-accent" aria-hidden>★</span>
                <span className="text-xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
                <span className="text-muted">{t("courseRating")}</span>
                <span className="text-muted">·</span>
                <span className="text-muted">{t("reviewsCount", { count: reviewCount })}</span>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {course.reviews.length > 0 ? (
                course.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border bg-background-card p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-sm font-bold text-accent-foreground">
                        {review.user.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <span className="font-semibold text-foreground">{review.user.name}</span>
                          <span className="text-xs text-muted">
                            {format.relativeTime(review.createdAt)}
                          </span>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                        {review.comment && (
                          <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">{t("noReviews")}</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-background-card p-6">
            <div className="text-3xl font-extrabold text-accent">
              {course.price > 0 ? format.number(course.price, { style: "currency", currency }) : t("free")}
            </div>

            {!session?.user && (
              <NextLink
                href={loginHref}
                className="mt-5 block w-full rounded-xl gold-gradient px-6 py-3 text-center font-bold text-accent-foreground transition hover:opacity-90"
              >
                {t("loginToEnroll")}
              </NextLink>
            )}
            {isStudent && course.price === 0 && (
              <div className="mt-5">
                <EnrollButton courseId={course.id} />
              </div>
            )}
            {isStudent && course.price > 0 && (
              <NextLink
                href="/contact"
                className="mt-5 block w-full rounded-xl gold-gradient px-6 py-3 text-center font-bold text-accent-foreground transition hover:opacity-90"
              >
                {t("contactToEnroll")}
              </NextLink>
            )}
            {session?.user && !isStudent && (
              <NextLink
                href="/dashboard"
                className="mt-5 block w-full rounded-xl border border-border px-6 py-3 text-center font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                {t("manageFromDashboard")}
              </NextLink>
            )}

            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>✔ {t("perks.fullAccess")}</li>
              <li>✔ {t("perks.materials")}</li>
              <li>✔ {t("perks.updates")}</li>
            </ul>
          </div>

          <Link
            href={`/trainers/${course.trainer.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-lg font-bold text-accent-foreground">
              {course.trainer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.trainer.avatarUrl} alt={course.trainer.name} className="h-full w-full object-cover object-top" />
              ) : (
                course.trainer.name.charAt(0)
              )}
            </div>
            <div>
              <p className="text-xs text-muted">{t("trainerLabel")}</p>
              <h3 className="font-bold text-foreground">{course.trainer.name}</h3>
              <p className="text-sm text-muted">{course.trainer.title ?? tTrainers("defaultTitle")}</p>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
}
