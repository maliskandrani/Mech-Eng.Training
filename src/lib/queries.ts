import { prisma } from "@/lib/prisma";

export function getPublishedCourses() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { trainer: true, category: true, _count: { select: { enrollments: true, modules: true } } },
  });
}

export function getAllCoursesForAdmin() {
  return prisma.course.findMany({
    orderBy: { order: "asc" },
    include: { trainer: true, category: true, _count: { select: { enrollments: true } } },
  });
}

export function getCoursesForTrainer(trainerId: string) {
  return prisma.course.findMany({
    where: { trainerId },
    orderBy: { order: "asc" },
    include: { category: true, _count: { select: { enrollments: true } } },
  });
}

export function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      trainer: true,
      category: true,
      modules: {
        orderBy: { order: "asc" },
        include: { materials: { orderBy: { order: "asc" } } },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      trainer: true,
      category: true,
      modules: {
        orderBy: { order: "asc" },
        include: { materials: { orderBy: { order: "asc" } } },
      },
      enrollments: { include: { user: true } },
    },
  });
}

export function getTrainers() {
  return prisma.user.findMany({
    where: { role: { in: ["ADMIN", "TRAINER"] } },
    include: { _count: { select: { coursesTaught: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export function getTrainerById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { coursesTaught: { where: { published: true }, include: { category: true } } },
  });
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function getStudentEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          trainer: true,
          modules: { orderBy: { order: "asc" }, include: { materials: { orderBy: { order: "asc" } } } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

export function getTrainerUsers() {
  return prisma.user.findMany({
    where: { role: "TRAINER" },
    include: { _count: { select: { coursesTaught: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getStudentUsers() {
  return prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });
}
