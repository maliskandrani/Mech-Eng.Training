import { prisma } from "@/lib/prisma";

export const PAGE_SIZE = 8;

const courseCardInclude = {
  trainer: true,
  category: true,
  _count: { select: { enrollments: true, sections: true } },
  sections: {
    select: {
      title: true,
      titleEn: true,
      _count: { select: { lessons: true } },
      lessons: { select: { materials: { select: { durationMinutes: true } } } },
    },
  },
  reviews: { select: { rating: true } },
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

/** Unpublished courses matching the same search/category filters, shown as "coming soon" cards. */
export function getComingSoonCourses(opts: { q?: string; categorySlug?: string }) {
  const { q, categorySlug } = opts;
  return prisma.course.findMany({
    where: {
      published: false,
      ...(q ? { title: { contains: q } } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    orderBy: { order: "asc" },
    include: courseCardInclude,
  });
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
      reviews: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
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

export function getMyEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } });
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
          sections: {
            select: {
              _count: { select: { lessons: true } },
              lessons: { select: { materials: { select: { durationMinutes: true } } } },
            },
          },
          reviews: { select: { rating: true } },
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
          category: true,
          reviews: { select: { rating: true } },
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

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: "main" } });
}

export function getStoryImages() {
  return prisma.storyImage.findMany({ orderBy: { order: "asc" } });
}

export function getContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export function getUnreadMessageCount() {
  return prisma.contactMessage.count({ where: { read: false } });
}

/** Material IDs within a course this user has an APPROVED purchase for. */
export async function getApprovedMaterialIds(userId: string, courseId: string): Promise<Set<string>> {
  const rows = await prisma.purchaseRequest.findMany({
    where: {
      userId,
      status: "APPROVED",
      material: { lesson: { section: { courseId } } },
    },
    select: { materialId: true },
  });
  return new Set(rows.map((r) => r.materialId).filter((id): id is string => id != null));
}

/** This user's latest purchase request for a given course or material (to show its status). */
export function getMyPurchaseRequest(userId: string, target: { courseId?: string; materialId?: string }) {
  return prisma.purchaseRequest.findFirst({
    where: { userId, courseId: target.courseId ?? null, materialId: target.materialId ?? null },
    orderBy: { createdAt: "desc" },
  });
}

const purchaseRequestInclude = {
  user: { select: { name: true, email: true } },
  course: { select: { id: true, slug: true, title: true, titleEn: true, trainerId: true, trainer: { select: { name: true } } } },
  material: {
    select: {
      id: true,
      title: true,
      lesson: { select: { section: { select: { course: { select: { id: true, slug: true, title: true, titleEn: true, trainerId: true, trainer: { select: { name: true } } } } } } } },
    },
  },
};

export function getPurchaseRequestsForAdmin() {
  return prisma.purchaseRequest.findMany({
    include: purchaseRequestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getPurchaseRequestsForTrainer(trainerId: string) {
  return prisma.purchaseRequest.findMany({
    where: {
      OR: [{ course: { trainerId } }, { material: { lesson: { section: { course: { trainerId } } } } }],
    },
    include: purchaseRequestInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getPendingPurchaseCount() {
  return prisma.purchaseRequest.count({ where: { status: { in: ["PENDING", "RECEIVED"] } } });
}

export function getPendingPurchaseCountForTrainer(trainerId: string) {
  return prisma.purchaseRequest.count({
    where: {
      status: "PENDING",
      OR: [{ course: { trainerId } }, { material: { lesson: { section: { course: { trainerId } } } } }],
    },
  });
}

/** Simple homepage load counter (not unique-visitor analytics). Safe to show publicly. */
export async function incrementHomeViews(): Promise<number> {
  const row = await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { homeViews: { increment: 1 } },
    create: { id: "main", homeViews: 1 },
  });
  return row.homeViews;
}

/** Revenue estimate per published course (price × enrollments) — admin-only figure. */
export async function getRevenueByCourse() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { title: true, price: true, _count: { select: { enrollments: true } } },
    orderBy: { order: "asc" },
  });
  return courses.map((c) => ({
    title: c.title,
    enrollments: c._count.enrollments,
    revenue: c.price * c._count.enrollments,
  }));
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
