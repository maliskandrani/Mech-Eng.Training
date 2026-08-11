import { Suspense } from "react";
import { searchTrainerUsers } from "@/lib/queries";
import { createUser, deleteUser } from "@/lib/actions/user-actions";
import CreateUserForm from "@/components/dashboard/CreateUserForm";
import { ConfirmDeleteButton } from "@/components/dashboard/ActionButtons";
import SearchInput from "@/components/ui/SearchInput";
import PaginationBar from "@/components/ui/PaginationBar";

export default async function AdminTrainersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items: trainers, totalPages } = await searchTrainerUsers({ q, page });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">المدربون</h1>
      <p className="mt-1 text-muted">أضف مدربين جدد لتوسيع فريق التدريب في الأكاديمية.</p>

      <div className="mt-6">
        <CreateUserForm action={createUser} role="TRAINER" />
      </div>

      <div className="mt-6">
        <Suspense>
          <SearchInput placeholder="ابحث باسم المدرب..." />
        </Suspense>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
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
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full gold-gradient text-sm font-bold text-accent-foreground">
                      {t.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatarUrl} alt={t.name} className="h-full w-full object-cover" />
                      ) : (
                        t.name.charAt(0)
                      )}
                    </div>
                    <span className="font-medium text-foreground">{t.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted">{t.email}</td>
                <td className="p-3 text-muted">{t.title ?? "—"}</td>
                <td className="p-3 text-muted">{t._count.coursesTaught}</td>
                <td className="p-3">
                  <ConfirmDeleteButton onConfirm={deleteUser.bind(null, t.id)} />
                </td>
              </tr>
            ))}
            {trainers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted">
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
        buildHref={(p) => `/dashboard/admin/trainers?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) }).toString()}`}
      />
    </div>
  );
}
