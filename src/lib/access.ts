import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error("يجب تسجيل الدخول.");
  return session.user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error("لا تملك صلاحية تنفيذ هذا الإجراء.");
  }
  return user;
}

/** Admin, or the trainer who owns the course, may manage it. */
export async function requireCourseManager(courseId: string) {
  const user = await requireUser();
  if (user.role === "ADMIN") return user;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { trainerId: true },
  });
  if (!course || course.trainerId !== user.id) {
    throw new Error("لا تملك صلاحية إدارة هذه الدورة.");
  }
  return user;
}

/** The first lesson of a course is a free preview, open to everyone. */
export async function isFreePreviewLesson(courseId: string, lessonId: string): Promise<boolean> {
  const firstSection = await prisma.section.findFirst({
    where: { courseId },
    orderBy: { order: "asc" },
    select: {
      lessons: { orderBy: { order: "asc" }, take: 1, select: { id: true } },
    },
  });
  return firstSection?.lessons[0]?.id === lessonId;
}

/** Admin, the owning trainer, or an enrolled student may view course materials. */
export async function canAccessCourseMaterials(courseId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  const user = session.user;
  if (user.role === "ADMIN") return true;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { trainerId: true },
  });
  if (!course) return false;
  if (course.trainerId === user.id) return true;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  return Boolean(enrollment);
}
