import { prisma } from "@/lib/prisma";
import { createCourse } from "@/lib/actions/course-actions";
import { getSiteSettings } from "@/lib/queries";
import CourseForm from "@/components/dashboard/CourseForm";

export default async function NewCoursePage() {
  const [trainers, categories, settings] = await Promise.all([
    prisma.user.findMany({ where: { role: { in: ["ADMIN", "TRAINER"] } }, select: { id: true, name: true } }),
    prisma.category.findMany({ select: { id: true, name: true } }),
    getSiteSettings(),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-foreground">دورة جديدة</h1>
      <div className="mt-6">
        <CourseForm
          action={createCourse}
          trainers={trainers}
          categories={categories}
          showTrainerSelect
          isAdmin
          currency={settings?.currency ?? "LYD"}
        />
      </div>
    </div>
  );
}
