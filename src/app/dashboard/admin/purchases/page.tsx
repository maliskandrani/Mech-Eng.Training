import { getPurchaseRequestsForAdmin } from "@/lib/queries";
import PurchaseRequestsTable from "@/components/dashboard/PurchaseRequestsTable";

export default async function AdminPurchasesPage() {
  const requests = await getPurchaseRequestsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">طلبات الشراء</h1>
        <p className="mt-1 text-muted">
          مراجعة طلبات شراء الدورات والمرفقات المدفوعة عبر التحويل المصرفي أو الكروت أو الدفع الكاش، والموافقة النهائية عليها.
        </p>
      </div>

      <PurchaseRequestsTable requests={requests} canApprove />
    </div>
  );
}
