"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function CoverImageUpload({
  coverImageUrl,
  action,
  size = "md",
}: {
  coverImageUrl: string | null;
  action: (formData: FormData) => Promise<ActionResult>;
  size?: "md" | "sm";
}) {
  const boxClass = size === "sm" ? "h-12 w-9" : "h-16 w-12";
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("cover", file);
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (!result.ok) {
        setError(result.error ?? "تعذر رفع الغلاف");
        return;
      }
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div className={`flex ${boxClass} items-center justify-center overflow-hidden rounded-md border border-border bg-background`}>
        {coverImageUrl ? (
          <Image src={coverImageUrl} alt="" width={48} height={64} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[9px] text-muted">لا يوجد</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        title="تغيير الغلاف"
        className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent disabled:opacity-60"
      >
        <span aria-hidden>📎</span>
        <span>{pending ? "..." : "غلاف"}</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} disabled={pending} />
      {error && <p className="max-w-16 text-center text-[9px] leading-tight text-red-400">{error}</p>}
    </div>
  );
}
