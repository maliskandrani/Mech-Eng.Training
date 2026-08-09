import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CourseManagePanel from "@/components/dashboard/CourseManagePanel";

export default async function TrainerCourseManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({ where: { id }, select: { trainerId: true } });
  if (!course || course.trainerId !== session?.user?.id) notFound();

  return <CourseManagePanel courseId={id} isAdmin={false} />;
}
