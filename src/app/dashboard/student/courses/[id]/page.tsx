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
          modules: { orderBy: { order: "asc" }, include: { materials: { orderBy: { order: "asc" } } } },
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
        {course.modules.map((mod, i) => (
          <div key={mod.id} className="rounded-2xl border border-border bg-background-card p-4">
            <h3 className="font-semibold text-foreground">
              {i + 1}. {mod.title}
            </h3>
            {mod.materials.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {mod.materials.map((mat) => (
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
      </div>
    </div>
  );
}
