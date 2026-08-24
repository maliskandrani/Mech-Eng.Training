"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmPurchaseReceipt, approvePurchase, rejectPurchase } from "@/lib/actions/purchase-actions";

export default function PurchaseActionButtons({
  requestId,
  status,
  canApprove,
}: {
  requestId: string;
  status: "PENDING" | "RECEIVED" | "APPROVED" | "REJECTED";
  /** Only admin sees approve/reject; trainers can only confirm receipt. */
  canApprove: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  async function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.ok) setError(res.error ?? "حدث خطأ غير متوقع");
      else router.refresh();
    });
  }

  if (status === "APPROVED") {
    return <span className="text-xs font-semibold text-green-300">تمت الموافقة ✓</span>;
  }
  if (status === "REJECTED") {
    return <span className="text-xs font-semibold text-red-300">مرفوض</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {status === "PENDING" && (
          <button
            disabled={pending}
            onClick={() => run(() => confirmPurchaseReceipt(requestId))}
            className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60"
          >
            تأكيد استلام الدفع
          </button>
        )}
        {canApprove && status === "RECEIVED" && (
          <button
            disabled={pending}
            onClick={() => run(() => approvePurchase(requestId))}
            className="rounded-lg border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300 transition hover:bg-green-400/20 disabled:opacity-60"
          >
            الموافقة النهائية
          </button>
        )}
        {canApprove && (
          <button
            disabled={pending}
            onClick={() => setShowReject((v) => !v)}
            className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
          >
            رفض
          </button>
        )}
      </div>

      {showReject && (
        <div className="flex w-full max-w-xs flex-col items-end gap-1.5">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="سبب الرفض (اختياري)"
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          />
          <button
            disabled={pending}
            onClick={() => run(() => rejectPurchase(requestId, reason))}
            className="rounded-lg bg-red-500/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            تأكيد الرفض
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
