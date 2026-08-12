"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function MaterialUploadForm({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("lessonId", lessonId);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/materials/upload", { method: "POST", body: formData });
        const result: { ok: boolean; error?: string } = await res.json();
        if (!result.ok) {
          setError(result.error ?? "حدث خطأ غير متوقع أثناء الرفع");
          return;
        }
        formRef.current?.reset();
        router.refresh();
      } catch {
        setError("تعذر الاتصال بالخادم. حاول مرة أخرى.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-3 grid gap-2 rounded-lg border border-dashed border-border p-3 sm:grid-cols-4"
    >
      <input
        name="title"
        required
        placeholder="عنوان الملف"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent sm:col-span-2"
      />
      <select
        name="type"
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      >
        <option value="BOOK">كتاب (PDF)</option>
        <option value="VIDEO">فيديو</option>
        <option value="SLIDE">سلايدز</option>
      </select>
      <input
        name="file"
        type="file"
        required
        className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-soft transition hover:bg-accent/20 disabled:opacity-60 sm:col-span-4"
      >
        {pending ? "جاري الرفع..." : "رفع الملف"}
      </button>
      {error && <p className="text-xs text-red-300 sm:col-span-4">{error}</p>}
    </form>
  );
}
