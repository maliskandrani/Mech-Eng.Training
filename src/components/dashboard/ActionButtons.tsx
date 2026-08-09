"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/auth-actions";

export function PublishToggle({
  courseId,
  published,
  action,
}: {
  courseId: string;
  published: boolean;
  action: (courseId: string, published: boolean) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await action(courseId, !published);
          router.refresh();
        })
      }
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
        published
          ? "border-green-300 text-green-700 hover:bg-green-50"
          : "border-border text-muted hover:border-accent hover:text-accent"
      }`}
    >
      {pending ? "..." : published ? "منشورة" : "مسودة"}
    </button>
  );
}

export function ConfirmDeleteButton({
  onConfirm,
  label = "حذف",
  confirmText = "هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
}: {
  onConfirm: () => Promise<ActionResult>;
  label?: string;
  confirmText?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          await onConfirm();
          router.refresh();
        });
      }}
      className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "..." : label}
    </button>
  );
}
