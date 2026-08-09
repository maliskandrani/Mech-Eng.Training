import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/queries";
import { formatPrice, LEVEL_LABELS, MATERIAL_TYPE_LABELS } from "@/lib/utils";
import VideoEmbed from "@/components/site/VideoEmbed";
import EnrollButton from "@/components/site/EnrollButton";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, session] = await Promise.all([getCourseBySlug(slug), auth()]);

  if (!course) notFound();

  const canPreviewDraft =
    session?.user?.role === "ADMIN" || session?.user?.id === course.trainerId;
  if (!course.published && !canPreviewDraft) notFound();

  const isStudent = session?.user?.role === "STUDENT";
  const totalMaterials = course.modules.reduce((n, m) => n + m.materials.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {!course.published && (
        <div className="mb-6 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
          هذه الدورة في وضع المسودة ولا يمكن للمتدربين رؤيتها إلا بعد النشر.
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {course.category && <span className="text-accent-soft">{course.category.name}</span>}
            <span>·</span>
            <span>{LEVEL_LABELS[course.level] ?? course.level}</span>
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
              <div className="flex h-full items-center justify-center text-muted">
                لم يتم رفع فيديو تقديمي أو صورة غلاف بعد
              </div>
            )}
          </div>

          {course.description && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground">عن الدورة</h2>
              <p className="mt-3 whitespace-pre-line leading-8 text-muted">{course.description}</p>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold text-foreground">محتوى الدورة</h2>
            <p className="mt-1 text-sm text-muted">
              {course.modules.length} وحدة · {totalMaterials} ملف تدريبي
            </p>
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
              {course.modules.map((mod, i) => (
                <div key={mod.id} className="p-4">
                  <h3 className="font-semibold text-foreground">
                    {i + 1}. {mod.title}
                  </h3>
                  {mod.materials.length > 0 ? (
                    <ul className="mt-2 space-y-1.5">
                      {mod.materials.map((mat) => (
                        <li key={mat.id} className="flex items-center gap-2 text-sm text-muted">
                          <span className="text-accent-soft">🔒</span>
                          <span>{mat.title}</span>
                          <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                            {MATERIAL_TYPE_LABELS[mat.type] ?? mat.type}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">المحتوى قيد الإضافة.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-background-card p-6">
            <div className="text-3xl font-extrabold text-accent">{formatPrice(course.price)}</div>

            {!session?.user && (
              <Link
                href={`/login?callbackUrl=/courses/${course.slug}`}
                className="mt-5 block w-full rounded-xl gold-gradient px-6 py-3 text-center font-bold text-accent-foreground transition hover:opacity-90"
              >
                سجّل دخولك للالتحاق
              </Link>
            )}
            {isStudent && <div className="mt-5"><EnrollButton courseId={course.id} /></div>}
            {session?.user && !isStudent && (
              <Link
                href="/dashboard"
                className="mt-5 block w-full rounded-xl border border-border px-6 py-3 text-center font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                إدارة الدورة من لوحة التحكم
              </Link>
            )}

            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>✔ الوصول الكامل لجميع مواد الدورة</li>
              <li>✔ كتب PDF وفيديوهات وسلايدز</li>
              <li>✔ تحديثات مستمرة على المحتوى</li>
            </ul>
          </div>

          <Link
            href={`/trainers/${course.trainer.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-background-card p-5 transition hover:border-accent/60"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-lg font-bold text-accent-foreground">
              {course.trainer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.trainer.avatarUrl} alt={course.trainer.name} className="h-full w-full object-cover" />
              ) : (
                course.trainer.name.charAt(0)
              )}
            </div>
            <div>
              <p className="text-xs text-muted">المدرب</p>
              <h3 className="font-bold text-foreground">{course.trainer.name}</h3>
              <p className="text-sm text-muted">{course.trainer.title ?? "مدرب معتمد"}</p>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
}
