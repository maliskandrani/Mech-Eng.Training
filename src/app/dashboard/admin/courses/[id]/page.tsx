import CourseManagePanel from "@/components/dashboard/CourseManagePanel";

export default async function AdminCourseManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseManagePanel courseId={id} isAdmin />;
}
