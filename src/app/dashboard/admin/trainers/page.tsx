import { getTrainerUsers } from "@/lib/queries";
import { createUser, deleteUser } from "@/lib/actions/user-actions";
import CreateUserForm from "@/components/dashboard/CreateUserForm";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";

export default async function AdminTrainersPage() {
  const trainers = await getTrainerUsers();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">المدربون</h1>
      <p className="mt-1 text-muted">أضف مدربين جدد لتوسيع فريق التدريب في الأكاديمية.</p>

      <div className="mt-6">
        <CreateUserForm action={createUser} role="TRAINER" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-background-elevated text-muted">
            <tr>
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">البريد الإلكتروني</th>
              <th className="p-3 text-right">اللقب</th>
              <th className="p-3 text-right">عدد الدورات</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trainers.map((t) => (
              <tr key={t.id} className="bg-background-card">
                <td className="p-3 font-medium text-foreground">{t.name}</td>
                <td className="p-3 text-muted">{t.email}</td>
                <td className="p-3 text-muted">{t.title ?? "—"}</td>
                <td className="p-3 text-muted">{t._count.coursesTaught}</td>
                <td className="p-3">
                  <ConfirmDeleteButton onConfirm={deleteUser.bind(null, t.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
