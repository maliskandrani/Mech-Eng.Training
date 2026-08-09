import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MATERIAL_TYPE_LABELS } from "@/lib/utils";
import VideoEmbed from "@/components/site/VideoEmbed";

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

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-foreground">{course.title}</h1>
      <p className="mt-1 text-muted">المدرب: {course.trainer.name}</p>

      {course.introVideoUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-background-card">
          <VideoEmbed url={course.introVideoUrl} />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {course.sections.map((section, si) => (
          <div key={section.id} className="rounded-2xl border border-border bg-background-card">
            <div className="border-b border-border px-4 py-3">
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
                    <ul className="mt-3 space-y-2">
                      {lesson.materials.map((mat) => (
                        <li
                          key={mat.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        >
                          <span className="text-foreground">{mat.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                              {MATERIAL_TYPE_LABELS[mat.type] ?? mat.type}
                            </span>
                            <a
                              href={`/api/files/${mat.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-soft transition hover:bg-accent/20"
                            >
                              {mat.type === "VIDEO" ? "مشاهدة" : "فتح / تحميل"}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">المحتوى قيد الإضافة من قِبل المدرب.</p>
                  )}
                </div>
              ))}
              {section.lessons.length === 0 && (
                <p className="p-4 text-sm text-muted">لا توجد دروس في هذا القسم بعد.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
