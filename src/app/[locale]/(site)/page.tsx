import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedCourses, getTrainers } from "@/lib/queries";
import CourseCard from "@/components/site/CourseCard";

export default async function HomePage() {
  const [courses, trainers, t, tTrainers] = await Promise.all([
    getPublishedCourses(),
    getTrainers(),
    getTranslations("home"),
    getTranslations("trainers"),
  ]);
  const featured = courses.slice(0, 6);

  const FEATURES = [
    { icon: "🎓", key: "content" as const },
    { icon: "🛠️", key: "practical" as const },
    { icon: "🎯", key: "skills" as const },
    { icon: "📈", key: "progress" as const },
  ];

  return (
    <div>
      <section className="section-glow relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm text-accent-soft">
              {t("badge")}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {t("titleLead")} <span className="gold-text-gradient">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-xl gold-gradient px-6 py-3 font-bold text-accent-foreground transition hover:opacity-90"
              >
                {t("ctaExplore")}
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                {t("ctaRegister")}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.key} className="rounded-2xl border border-border bg-background-card p-5">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-3 font-bold text-foreground">{t(`features.${f.key}.title`)}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{t(`features.${f.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("coursesTitle")}</h2>
            <p className="mt-1 text-muted">{t("coursesSubtitle")}</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-accent hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-muted">{t("noCourses")}</p>
        )}
      </section>

      {trainers.length > 0 && (
        <section className="border-t border-border bg-background-elevated">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold text-foreground">{t("trainersTitle")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainers.map((trainer) => (
                <Link
                  key={trainer.id}
                  href={`/trainers/${trainer.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-xl font-bold text-accent-foreground">
                    {trainer.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={trainer.avatarUrl} alt={trainer.name} className="h-full w-full object-cover" />
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
          </div>
        </section>
      )}
    </div>
  );
}
