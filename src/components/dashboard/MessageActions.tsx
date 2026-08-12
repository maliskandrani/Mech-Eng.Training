"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function MessageActions({
  messageId,
  read,
  onMarkRead,
  onDelete,
}: {
  messageId: string;
  read: boolean;
  onMarkRead: (id: string) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {!read && (
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await onMarkRead(messageId);
              router.refresh();
            })
          }
          className="rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60"
        >
          تحديد كمقروءة
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => {
          if (!window.confirm("هل تريد حذف هذه الرسالة؟")) return;
          startTransition(async () => {
            await onDelete(messageId);
            router.refresh();
          });
        }}
        className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
      >
        حذف
      </button>
    </div>
  );
}
