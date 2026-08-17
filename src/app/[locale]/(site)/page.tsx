import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getPublishedCourses,
  getTrainers,
  getStoryImages,
  getSiteSettings,
  incrementHomeViews,
  getTotalTrainingMinutes,
} from "@/lib/queries";
import CourseCard from "@/components/site/CourseCard";
import StoryCarousel from "@/components/site/StoryCarousel";
import BarChart from "@/components/site/BarChart";
import PieChart from "@/components/site/PieChart";

const CHART_PALETTE = ["#d4af37", "#24407e", "#5c9e7a", "#b0567a", "#8fa5d6"];

export default async function HomePage() {
  const [courses, trainers, storySlides, settings, homeViews, totalMinutes, t, tTrainers] = await Promise.all([
    getPublishedCourses(),
    getTrainers(),
    getStoryImages(),
    getSiteSettings(),
    incrementHomeViews(),
    getTotalTrainingMinutes(),
    getTranslations("home"),
    getTranslations("trainers"),
  ]);
  const featured = courses.slice(0, 6);
  const mainTrainer = trainers[0];
  const currency = settings?.currency ?? "LYD";

  const totalLessons = courses.reduce(
    (n, c) => n + c.sections.reduce((m, s) => m + s._count.lessons, 0),
    0
  );
  const totalHours = totalMinutes / 60;

  const STATS = [
    { value: courses.length, label: t("stats.courses") },
    { value: totalLessons, label: t("stats.lessons") },
    ...(totalHours > 0 ? [{ value: totalHours.toFixed(1), label: t("stats.hours") }] : []),
    { value: homeViews, label: t("stats.views") },
  ];

  const categoryCounts = new Map<string, number>();
  for (const c of courses) {
    const name = c.category?.name ?? "—";
    categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1);
  }
  const categoryData = Array.from(categoryCounts.entries()).map(([label, value], i) => ({
    label,
    value,
    color: CHART_PALETTE[i % CHART_PALETTE.length],
  }));

  const flagship = courses[0];
  const contentData =
    flagship?.sections.map((s) => ({ label: s.title, value: s._count.lessons })) ?? [];

  const FEATURES = [
    { icon: "🎓", key: "content" as const },
    { icon: "🛠️", key: "practical" as const },
    { icon: "🎯", key: "skills" as const },
    { icon: "📈", key: "progress" as const },
  ];

  return (
    <div>
      <section className="hero-navy relative overflow-hidden text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-2 sm:px-6">
          <StoryCarousel slides={storySlides} />

          <div className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-4 border-t border-white/10 pt-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-accent">{s.value}</div>
                <div className="mt-1 text-xs text-navy-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.key} className="rounded-2xl border border-border bg-background-card p-5">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-foreground">{t(`features.${f.key}.title`)}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{t(`features.${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("coursesTitle")}</h2>
            <p className="mt-1 text-muted">{t("coursesSubtitle")}</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-accent-soft hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} currency={currency} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-muted">{t("noCourses")}</p>
        )}
      </section>

      {(categoryData.length > 0 || contentData.length > 0) && (
        <section className="border-t border-border bg-background-elevated">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground">{t("insightsTitle")}</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {categoryData.length > 0 && (
                <div className="rounded-2xl border border-border bg-background-card p-6">
                  <h3 className="font-bold text-foreground">{t("categoryChartTitle")}</h3>
                  <div className="mt-5">
                    <PieChart data={categoryData} />
                  </div>
                </div>
              )}
              {contentData.length > 0 && (
                <div className="rounded-2xl border border-border bg-background-card p-6">
                  <h3 className="font-bold text-foreground">{t("contentChartTitle")}</h3>
                  <div className="mt-5">
                    <BarChart data={contentData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {mainTrainer && (
        <section className="border-t border-border bg-background-elevated">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="text-sm font-semibold text-accent-soft">{tTrainers("pageTitle")}</span>
                <h2 className="mt-2 text-2xl font-bold text-foreground">{mainTrainer.name}</h2>
                {mainTrainer.bio && (
                  <p className="mt-4 leading-7 text-muted">{mainTrainer.bio}</p>
                )}
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <li key={f.key} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="text-accent-soft">✔</span>
                      <span>{t(`features.${f.key}.title`)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/trainers/${mainTrainer.id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-navy-foreground transition hover:bg-navy-soft"
                >
                  {tTrainers("pageTitle")} <span aria-hidden>←</span>
                </Link>
              </div>

              <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-navy sm:h-72">
                {mainTrainer.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainTrainer.avatarUrl}
                    alt={mainTrainer.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <span className="text-6xl font-extrabold text-navy-foreground/80">
                    {mainTrainer.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {trainers.length > 1 && (
              <div className="mt-14 grid gap-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {trainers.slice(1).map((trainer) => (
                  <Link
                    key={trainer.id}
                    href={`/trainers/${trainer.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-xl font-bold text-accent-foreground">
                      {trainer.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={trainer.avatarUrl} alt={trainer.name} className="h-full w-full object-cover object-top" />
                      ) : (
                        trainer.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{trainer.name}</h3>
                      <p className="text-sm text-muted">{trainer.title ?? tTrainers("defaultTitle")}</p>
                      <p className="mt-1 text-xs text-accent-soft">
                        {tTrainers("coursesCount", { count: trainer._count.coursesTaught })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
