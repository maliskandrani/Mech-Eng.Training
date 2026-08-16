"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function InlineRename({
  value,
  action,
  textClassName,
}: {
  value: string;
  action: (formData: FormData) => Promise<ActionResult>;
  textClassName: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <div className="flex flex-1 items-center gap-2">
        <span className={`flex-1 ${textClassName}`}>{value}</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="تعديل الاسم"
          className="shrink-0 text-xs text-muted transition hover:text-accent"
        >
          ✎
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-1 items-center gap-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setError(null);
        startTransition(async () => {
          const result = await action(formData);
          if (!result.ok) {
            setError(result.error ?? "تعذر الحفظ");
            return;
          }
          setEditing(false);
          router.refresh();
        });
      }}
    >
      <input
        name="title"
        defaultValue={value}
        autoFocus
        className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-lg border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60"
      >
        {pending ? "..." : "حفظ"}
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="shrink-0 text-xs text-muted transition hover:text-accent"
      >
        إلغاء
      </button>
      {error && <span className="shrink-0 text-xs text-red-400">{error}</span>}
    </form>
  );
}
