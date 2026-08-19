import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById, getSiteSettings } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { arabicCount, formatPrice } from "@/lib/utils";
import CourseForm from "@/components/dashboard/CourseForm";
import EnrollForm from "@/components/dashboard/EnrollForm";
import Tabs from "@/components/dashboard/Tabs";
import CourseContentEditor from "@/components/dashboard/CourseContentEditor";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import {
  updateCourse,
  createSection,
  deleteSection,
  reorderSections,
  updateSectionTitle,
  createLesson,
  deleteLesson,
  reorderLessons,
  updateLessonTitle,
  updateSectionCover,
  updateLessonCover,
} from "@/lib/actions/course-actions";
import { deleteMaterial, setMaterialFree } from "@/lib/actions/material-actions";
import { enrollStudent, unenrollStudent } from "@/lib/actions/user-actions";

export default async function CourseManagePanel({
  courseId,
  isAdmin,
}: {
  courseId: string;
  isAdmin: boolean;
}) {
  const [course, settings] = await Promise.all([getCourseById(courseId), getSiteSettings()]);
  if (!course) notFound();
  const currency = settings?.currency ?? "LYD";

  const categories = isAdmin ? await prisma.category.findMany({ select: { id: true, name: true } }) : [];
  const trainers = isAdmin
    ? await prisma.user.findMany({ where: { role: { in: ["ADMIN", "TRAINER"] } }, select: { id: true, name: true } })
    : [];

  const lessonCount = course.sections.reduce((n, s) => n + s.lessons.length, 0);
  const materialCount = course.sections.reduce(
    (n, s) => n + s.lessons.reduce((m, l) => m + l.materials.length, 0),
    0
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{course.title}</h1>
          <p className="text-sm text-muted">
            {course.published ? "منشورة" : "مسودة"} · {formatPrice(course.price, currency)} ·{" "}
            {arabicCount(course.enrollments.length, "متدرب مسجَّل", "متدربان مسجَّلان", "متدربين مسجَّلين")}
          </p>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          target="_blank"
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-accent"
        >
          عرض صفحة الدورة
        </Link>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            {
              key: "overview",
              label: "نظرة عامة",
              content: (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-background-card p-5">
                    <p className="text-sm text-muted">الأقسام</p>
                    <p className="mt-2 text-3xl font-extrabold text-accent">{course.sections.length}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background-card p-5">
                    <p className="text-sm text-muted">الدروس</p>
                    <p className="mt-2 text-3xl font-extrabold text-accent">{lessonCount}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background-card p-5">
                    <p className="text-sm text-muted">الملفات التدريبية</p>
                    <p className="mt-2 text-3xl font-extrabold text-accent">{materialCount}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "content",
              label: "المحتوى",
              content: (
                <CourseContentEditor
                  sections={course.sections}
                  isAdmin={isAdmin}
                  createSection={createSection.bind(null, course.id)}
                  deleteSection={deleteSection}
                  reorderSections={reorderSections.bind(null, course.id)}
                  updateSectionTitle={updateSectionTitle}
                  createLesson={createLesson}
                  deleteLesson={deleteLesson}
                  reorderLessons={reorderLessons}
                  updateLessonTitle={updateLessonTitle}
                  deleteMaterial={deleteMaterial}
                  updateSectionCover={updateSectionCover}
                  updateLessonCover={updateLessonCover}
                  setMaterialFree={setMaterialFree}
                />
              ),
            },
            {
              key: "students",
              label: "المتدربون",
              content: (
                <div className="rounded-2xl border border-border bg-background-card p-4">
                  <EnrollForm action={enrollStudent.bind(null, course.id)} />

                  {course.enrollments.length > 0 ? (
                    <ul className="mt-4 divide-y divide-border">
                      {course.enrollments.map((enr) => (
                        <li key={enr.id} className="flex items-center justify-between py-2 text-sm">
                          <span className="text-foreground">
                            {enr.user.name} <span className="text-muted">({enr.user.email})</span>
                          </span>
                          <ConfirmDeleteButton onConfirm={unenrollStudent.bind(null, enr.id)} label="إلغاء التسجيل" />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-muted">لا يوجد متدربون مسجلون بعد.</p>
                  )}
                </div>
              ),
            },
            {
              key: "settings",
              label: "الإعدادات",
              content: (
                <CourseForm
                  action={updateCourse.bind(null, course.id)}
                  trainers={trainers}
                  categories={categories}
                  currency={currency}
                  showTrainerSelect={isAdmin}
                  isAdmin={isAdmin}
                  initial={{
                    title: course.title,
                    titleEn: course.titleEn,
                    subtitle: course.subtitle,
                    subtitleEn: course.subtitleEn,
                    description: course.description,
                    price: course.price,
                    totalHours: course.totalHours,
                    level: course.level,
                    categoryId: course.categoryId,
                    trainerId: course.trainerId,
                    introVideoUrl: course.introVideoUrl,
                  }}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
