import { prisma } from "@/lib/prisma";

export const PAGE_SIZE = 8;

const courseCardInclude = {
  trainer: true,
  category: true,
  _count: { select: { enrollments: true, sections: true } },
  sections: { select: { _count: { select: { lessons: true } } } },
};

export function getPublishedCourses() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: courseCardInclude,
  });
}

export async function searchPublishedCourses(opts: { q?: string; categorySlug?: string; page?: number }) {
  const { q, categorySlug, page = 1 } = opts;
  const where = {
    published: true,
    ...(q ? { title: { contains: q } } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: { order: "asc" as const },
      include: courseCardInclude,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.course.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function searchCoursesForAdmin(opts: { q?: string; page?: number }) {
  const { q, page = 1 } = opts;
  const where = q ? { title: { contains: q } } : {};
  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: { order: "asc" as const },
      include: { trainer: true, category: true, _count: { select: { enrollments: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.course.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getCoursesForTrainer(trainerId: string) {
  return prisma.course.findMany({
    where: { trainerId },
    orderBy: { order: "asc" },
    include: { category: true, _count: { select: { enrollments: true } } },
  });
}

const courseContentInclude = {
  sections: {
    orderBy: { order: "asc" as const },
    include: {
      lessons: {
        orderBy: { order: "asc" as const },
        include: { materials: { orderBy: { order: "asc" as const } } },
      },
    },
  },
};

export function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      trainer: true,
      category: true,
      ...courseContentInclude,
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
      ...courseContentInclude,
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
    include: {
      coursesTaught: {
        where: { published: true },
        include: {
          category: true,
          _count: { select: { sections: true } },
          sections: { select: { _count: { select: { lessons: true } } } },
        },
      },
    },
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
          ...courseContentInclude,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

export async function searchTrainerUsers(opts: { q?: string; page?: number }) {
  const { q, page = 1 } = opts;
  const where = {
    role: "TRAINER" as const,
    ...(q ? { name: { contains: q } } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { coursesTaught: true } } },
      orderBy: { createdAt: "desc" as const },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function searchStudentUsers(opts: { q?: string; page?: number }) {
  const { q, page = 1 } = opts;
  const where = {
    role: "STUDENT" as const,
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" as const },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
