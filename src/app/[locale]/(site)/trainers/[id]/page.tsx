import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getTrainerById, getSiteSettings } from "@/lib/queries";
import { localizedName, localizedTitle } from "@/lib/utils";
import CourseCard from "@/components/site/CourseCard";

export default async function TrainerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [trainer, settings, t, locale] = await Promise.all([
    getTrainerById(id),
    getSiteSettings(),
    getTranslations("trainers"),
    getLocale(),
  ]);
  if (!trainer) notFound();
  const currency = settings?.currency ?? "LYD";
  const name = localizedName(trainer.name, trainer.nameEn, trainer.designation, locale);
  const title = trainer.title ? localizedTitle(trainer.title, trainer.titleEn, locale) : t("defaultTitle");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-background-card p-8 text-center sm:flex-row sm:rtl:text-right sm:ltr:text-left">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-4xl font-bold text-accent-foreground">
          {trainer.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={trainer.avatarUrl} alt={name} className="h-full w-full object-cover object-top" />
          ) : (
            trainer.name.charAt(0)
          )}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{name}</h1>
          <p className="mt-1 font-medium text-accent-soft">{title}</p>
          {trainer.bio && (
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              {localizedTitle(trainer.bio, trainer.bioEn, locale)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground">{t("coursesTitle", { name })}</h2>
        {trainer.coursesTaught.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainer.coursesTaught.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  ...course,
                  trainer: { name: trainer.name, nameEn: trainer.nameEn, designation: trainer.designation },
                }}
                currency={currency}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted">{t("noCourses")}</p>
        )}
      </div>
    </div>
  );
}
