import NextLink from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedHref } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { canAccessCourseMaterials } from "@/lib/access";
import { getCourseBySlug, getSiteSettings } from "@/lib/queries";
import { MATERIAL_TYPE_ICONS, formatDuration, formatPrice, localizedTitle } from "@/lib/utils";

export default async function CourseMaterialsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, settings, session, locale, t] = await Promise.all([
    getCourseBySlug(slug),
    getSiteSettings(),
    auth(),
    getLocale(),
    getTranslations("courses"),
  ]);
  if (!course) notFound();

  const canPreviewDraft = session?.user?.role === "ADMIN" || session?.user?.id === course.trainerId;
  if (!course.published && !canPreviewDraft) notFound();

  const currency = settings?.currency ?? "LYD";
  const title = localizedTitle(course.title, course.titleEn, locale);
  const isLoggedIn = Boolean(session?.user);
  const hasFullAccess = await canAccessCourseMaterials(course.id);
  const loginHref = `${localizedHref(locale, "/login")}?callbackUrl=${encodeURIComponent(
    localizedHref(locale, `/courses/${course.slug}/materials`)
  )}`;

  const items = course.sections.flatMap((section) =>
    section.lessons.flatMap((lesson) =>
      lesson.materials.map((mat) => ({
        ...mat,
        sectionTitle: localizedTitle(section.title, section.titleEn, locale),
        lessonTitle: localizedTitle(lesson.title, lesson.titleEn, locale),
      }))
    )
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href={`/courses/${course.slug}`}
        className="text-sm font-semibold text-accent-soft hover:underline"
      >
        ← {title}
      </Link>

      <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">{t("materialsPageTitle")}</h1>
      <p className="mt-2 text-muted">{t("materialsPageSubtitle")}</p>

      {items.length > 0 ? (
        <div className="mt-8 space-y-3">
          {items.map((mat) => {
            const isFree = mat.price == null || mat.price <= 0;
            const unlocked = hasFullAccess || (isFree && isLoggedIn);
            const duration = formatDuration(mat.durationMinutes, locale);

            return (
              <div
                key={mat.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background-card p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{MATERIAL_TYPE_ICONS[mat.type] ?? ""}</span>
                    <h3 className="font-bold text-foreground">{mat.title}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {mat.sectionTitle} · {mat.lessonTitle}
                    {duration ? ` · ${duration}` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                      isFree
                        ? "border-accent/40 bg-accent/10 text-accent-soft"
                        : "border-border text-muted"
                    }`}
                  >
                    {isFree ? `🎁 ${t("free")}` : formatPrice(mat.price ?? 0, currency, locale)}
                  </span>

                  {unlocked ? (
                    <a
                      href={`/api/files/${mat.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-navy-foreground transition hover:bg-navy-soft"
                    >
                      {mat.type === "VIDEO" ? t("watch") : t("openOrDownload")}
                    </a>
                  ) : isFree ? (
                    <NextLink
                      href={loginHref}
                      className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                    >
                      {t("loginToEnroll")}
                    </NextLink>
                  ) : (
                    <NextLink
                      href="/contact"
                      className="rounded-lg gold-gradient px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
                    >
                      {t("contactToBuy")}
                    </NextLink>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-8 text-muted">{t("noMaterialsYet")}</p>
      )}
    </div>
  );
}
