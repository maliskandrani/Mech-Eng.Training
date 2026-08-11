import Image from "next/image";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedHref } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/queries";
import VideoEmbed from "@/components/site/VideoEmbed";
import EnrollButton from "@/components/site/EnrollButton";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, session, locale, t, tTrainers, format] = await Promise.all([
    getCourseBySlug(slug),
    auth(),
    getLocale(),
    getTranslations("courses"),
    getTranslations("trainers"),
    getFormatter(),
  ]);

  if (!course) notFound();

  const canPreviewDraft =
    session?.user?.role === "ADMIN" || session?.user?.id === course.trainerId;
  if (!course.published && !canPreviewDraft) notFound();

  const isStudent = session?.user?.role === "STUDENT";
  const lessons = course.sections.flatMap((s) => s.lessons);
  const totalMaterials = lessons.reduce((n, l) => n + l.materials.length, 0);
  const loginHref = `${localizedHref(locale, "/login")}?callbackUrl=${encodeURIComponent(
    localizedHref(locale, `/courses/${course.slug}`)
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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
          </div>

          <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">{course.title}</h1>
          {course.subtitle && <p className="mt-3 text-lg text-muted">{course.subtitle}</p>}

          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-background-card">
            {course.introVideoUrl ? (
              <VideoEmbed url={course.introVideoUrl} />
            ) : course.posterUrl ? (
              <div className="relative h-full w-full">
                <Image src={course.posterUrl} alt={course.title} fill className="object-cover" />
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
              {t("lessonsCount", { count: lessons.length })} ·{" "}
              {t("materialsCount", { count: totalMaterials })}
            </p>
            <div className="mt-4 space-y-4">
              {course.sections.map((section, si) => (
                <div key={section.id} className="rounded-2xl border border-border">
                  <div className="border-b border-border bg-background-elevated px-4 py-3">
                    <h3 className="font-bold text-foreground">
                      {si + 1}. {section.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-border">
                    {section.lessons.map((lesson, li) => (
                      <div key={lesson.id} className="p-4">
                        <h4 className="font-semibold text-foreground">
                          {si + 1}.{li + 1} {lesson.title}
                        </h4>
                        {lesson.materials.length > 0 ? (
                          <ul className="mt-2 space-y-1.5">
                            {lesson.materials.map((mat) => (
                              <li key={mat.id} className="flex items-center gap-2 text-sm text-muted">
                                <span className="text-accent-soft">🔒</span>
                                <span>{mat.title}</span>
                                <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                                  {t(`materialType.${mat.type}` as "materialType.BOOK")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-muted">{t("contentPending")}</p>
                        )}
                      </div>
                    ))}
                    {section.lessons.length === 0 && (
                      <p className="p-4 text-sm text-muted">{t("lessonsPendingInSection")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-background-card p-6">
            <div className="text-3xl font-extrabold text-accent">
              {course.price > 0 ? format.number(course.price, { style: "currency", currency: "SAR" }) : t("free")}
            </div>

            {!session?.user && (
              <NextLink
                href={loginHref}
                className="mt-5 block w-full rounded-xl gold-gradient px-6 py-3 text-center font-bold text-accent-foreground transition hover:opacity-90"
              >
                {t("loginToEnroll")}
              </NextLink>
            )}
            {isStudent && <div className="mt-5"><EnrollButton courseId={course.id} /></div>}
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
