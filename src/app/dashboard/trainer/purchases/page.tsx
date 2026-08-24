import { auth } from "@/lib/auth";
import { getPurchaseRequestsForTrainer } from "@/lib/queries";
import PurchaseRequestsTable from "@/components/dashboard/PurchaseRequestsTable";

export default async function TrainerPurchasesPage() {
  const session = await auth();
  const requests = await getPurchaseRequestsForTrainer(session!.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">طلبات الشراء</h1>
        <p className="mt-1 text-muted">
          طلبات شراء دوراتك أو مرفقاتك المدفوعة. بعد استلامك المبلغ فعليًا (تحويل/كرت/كاش)، أكّد الاستلام هنا لتنتقل
          الموافقة النهائية للإدارة.
        </p>
      </div>

      <PurchaseRequestsTable requests={requests} canApprove={false} />
    </div>
  );
}
