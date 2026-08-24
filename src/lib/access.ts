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

/**
 * Admin or the owning trainer can always view/download every material in a course,
 * including priced ones, for management and preview purposes.
 *
 * Course enrollment alone does NOT grant this — a priced material is a separate,
 * individually-sold attachment (see courses/[slug]/materials), not something
 * enrollment unlocks. Only materials the admin marks free (price null/0) are
 * included with the course, and those are already open to any logged-in user.
 */
export async function isCourseManager(courseId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  const user = session.user;
  if (user.role === "ADMIN") return true;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { trainerId: true },
  });
  return course?.trainerId === user.id;
}
