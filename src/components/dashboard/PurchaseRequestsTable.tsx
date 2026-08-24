import { PAYMENT_METHOD_LABELS, PURCHASE_STATUS_LABELS } from "@/lib/utils";
import PurchaseActionButtons from "@/components/dashboard/PurchaseActionButtons";
import type { getPurchaseRequestsForAdmin } from "@/lib/queries";

type PurchaseRequestRow = Awaited<ReturnType<typeof getPurchaseRequestsForAdmin>>[number];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "border-border text-muted",
  RECEIVED: "border-accent/40 bg-accent/10 text-accent-soft",
  APPROVED: "border-green-400/30 bg-green-400/10 text-green-300",
  REJECTED: "border-red-400/30 bg-red-400/10 text-red-300",
};

export default function PurchaseRequestsTable({
  requests,
  canApprove,
}: {
  requests: PurchaseRequestRow[];
  canApprove: boolean;
}) {
  if (requests.length === 0) {
    return <p className="text-sm text-muted">لا توجد طلبات شراء حتى الآن.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-background-elevated text-xs text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-semibold">المتدرب</th>
            <th className="px-4 py-3 text-start font-semibold">العنصر</th>
            <th className="px-4 py-3 text-start font-semibold">المبلغ</th>
            <th className="px-4 py-3 text-start font-semibold">طريقة الدفع</th>
            <th className="px-4 py-3 text-start font-semibold">الإثبات</th>
            <th className="px-4 py-3 text-start font-semibold">الحالة</th>
            <th className="px-4 py-3 text-start font-semibold">إجراء</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.map((r) => {
            const course = r.course ?? r.material?.lesson.section.course;
            const itemLabel = r.course ? r.course.title : r.material?.title;
            return (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{r.user.name}</p>
                  <p className="text-xs text-muted">{r.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{itemLabel}</p>
                  {r.material && <p className="text-xs text-muted">مرفق ضمن: {course?.title}</p>}
                  {course && <p className="mt-0.5 text-xs text-muted">المدرب: {course.trainer.name}</p>}
                  {r.note && <p className="mt-0.5 text-xs text-muted">ملاحظة: {r.note}</p>}
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">{Math.round(r.amount)}</td>
                <td className="px-4 py-3 text-muted">{PAYMENT_METHOD_LABELS[r.paymentMethod] ?? r.paymentMethod}</td>
                <td className="px-4 py-3">
                  <a
                    href={`/api/payment-proofs/${r.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-soft hover:underline"
                  >
                    عرض
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[r.status] ?? ""}`}
                  >
                    {PURCHASE_STATUS_LABELS[r.status] ?? r.status}
                  </span>
                  {r.status === "REJECTED" && r.rejectionReason && (
                    <p className="mt-1 text-xs text-red-300">{r.rejectionReason}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <PurchaseActionButtons requestId={r.id} status={r.status} canApprove={canApprove} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
