import { Suspense } from "react";
import { searchStudentUsers } from "@/lib/queries";
import { createUser, deleteUser } from "@/lib/actions/user-actions";
import CreateUserForm from "@/components/dashboard/CreateUserForm";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import SearchInput from "@/components/ui/SearchInput";
import PaginationBar from "@/components/ui/PaginationBar";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items: students, totalPages } = await searchStudentUsers({ q, page });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">المتدربون</h1>
      <p className="mt-1 text-muted">يمكنك إضافة حساب متدرب يدويًا، أو الانتظار حتى يسجّل بنفسه عبر صفحة التسجيل.</p>

      <div className="mt-6">
        <CreateUserForm action={createUser} role="STUDENT" />
      </div>

      <div className="mt-6">
        <Suspense>
          <SearchInput placeholder="ابحث بالاسم أو البريد الإلكتروني..." />
        </Suspense>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-background-elevated text-muted">
            <tr>
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">البريد الإلكتروني</th>
              <th className="p-3 text-right">عدد الدورات المسجلة</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((s) => (
              <tr key={s.id} className="bg-background-card">
                <td className="p-3 font-medium text-foreground">{s.name}</td>
                <td className="p-3 text-muted">{s.email}</td>
                <td className="p-3 text-muted">{s._count.enrollments}</td>
                <td className="p-3">
                  <ConfirmDeleteButton onConfirm={deleteUser.bind(null, s.id)} />
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">
                  لا توجد نتائج مطابقة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `/dashboard/admin/students?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) }).toString()}`}
      />
    </div>
  );
}
