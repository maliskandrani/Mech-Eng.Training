"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function InlineRename({
  value,
  valueEn,
  action,
  textClassName,
}: {
  value: string;
  valueEn?: string | null;
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
        <div className="flex-1">
          <span className={textClassName}>{value}</span>
          {valueEn && <p className="text-xs text-muted" dir="ltr">{valueEn}</p>}
        </div>
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
      className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center"
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
      <div className="flex flex-1 flex-col gap-1.5">
        <input
          name="title"
          defaultValue={value}
          autoFocus
          placeholder="الاسم بالعربية"
          className="min-w-0 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-accent"
        />
        <input
          name="titleEn"
          defaultValue={valueEn ?? ""}
          dir="ltr"
          placeholder="English name (optional)"
          className="min-w-0 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60"
        >
          {pending ? "..." : "حفظ"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs text-muted transition hover:text-accent"
        >
          إلغاء
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </form>
  );
}
