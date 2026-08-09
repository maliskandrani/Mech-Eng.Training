import { getStudentUsers } from "@/lib/queries";
import { createUser, deleteUser } from "@/lib/actions/user-actions";
import CreateUserForm from "@/components/dashboard/CreateUserForm";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";

export default async function AdminStudentsPage() {
  const students = await getStudentUsers();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">المتدربون</h1>
      <p className="mt-1 text-muted">يمكنك إضافة حساب متدرب يدويًا، أو الانتظار حتى يسجّل بنفسه عبر صفحة التسجيل.</p>

      <div className="mt-6">
        <CreateUserForm action={createUser} role="STUDENT" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
