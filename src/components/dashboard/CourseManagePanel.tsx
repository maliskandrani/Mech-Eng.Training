import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { arabicCount, formatPrice, MATERIAL_TYPE_LABELS } from "@/lib/utils";
import CourseForm from "@/components/dashboard/CourseForm";
import ModuleForm from "@/components/dashboard/ModuleForm";
import MaterialUploadForm from "@/components/dashboard/MaterialUploadForm";
import EnrollForm from "@/components/dashboard/EnrollForm";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import { updateCourse, createModule, deleteModule } from "@/lib/actions/course-actions";
import { uploadMaterial, deleteMaterial } from "@/lib/actions/material-actions";
import { enrollStudent, unenrollStudent } from "@/lib/actions/user-actions";

export default async function CourseManagePanel({
  courseId,
  isAdmin,
}: {
  courseId: string;
  isAdmin: boolean;
}) {
  const course = await getCourseById(courseId);
  if (!course) notFound();

  const categories = isAdmin ? await prisma.category.findMany({ select: { id: true, name: true } }) : [];
  const trainers = isAdmin
    ? await prisma.user.findMany({ where: { role: { in: ["ADMIN", "TRAINER"] } }, select: { id: true, name: true } })
    : [];

  const boundUpdate = updateCourse.bind(null, course.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{course.title}</h1>
          <p className="text-sm text-muted">
            {course.published ? "منشورة" : "مسودة"} · {formatPrice(course.price)} ·{" "}
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

      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">تعديل بيانات الدورة</h2>
        <CourseForm
          action={boundUpdate}
          trainers={trainers}
          categories={categories}
          showTrainerSelect={isAdmin}
          initial={{
            title: course.title,
            subtitle: course.subtitle,
            description: course.description,
            price: course.price,
            level: course.level,
            categoryId: course.categoryId,
            trainerId: course.trainerId,
            introVideoUrl: course.introVideoUrl,
          }}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">محتوى الدورة (الوحدات والملفات)</h2>
        <div className="mb-4 rounded-2xl border border-border bg-background-card p-4">
          <ModuleForm action={createModule.bind(null, course.id)} />
        </div>

        <div className="space-y-4">
          {course.modules.map((mod, i) => (
            <div key={mod.id} className="rounded-2xl border border-border bg-background-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {i + 1}. {mod.title}
                </h3>
                <ConfirmDeleteButton
                  onConfirm={deleteModule.bind(null, mod.id)}
                  confirmText="سيتم حذف الوحدة وجميع ملفاتها. هل أنت متأكد؟"
                />
              </div>

              {mod.materials.length > 0 && (
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
                        <ConfirmDeleteButton onConfirm={deleteMaterial.bind(null, mat.id)} label="حذف" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <MaterialUploadForm action={uploadMaterial.bind(null, mod.id)} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-foreground">المتدربون المسجلون</h2>
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
      </section>
    </div>
  );
}
