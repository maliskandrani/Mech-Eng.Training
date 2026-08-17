"use client";

import { useEffect, useRef, useState } from "react";

export default function FileUploadField({
  name,
  accept,
  required,
  className,
}: {
  name: string;
  accept?: string;
  required?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  // Native/React form resets (form.reset(), or an action's automatic reset
  // on success) clear the underlying <input> without firing "change", so
  // listen for the form's own "reset" event to keep the label in sync.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => setFileName("");
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-2 transition focus-within:border-accent ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title="اختيار ملف"
        aria-label="اختيار ملف"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background-card text-muted transition hover:border-accent hover:bg-accent/10 hover:text-accent"
      >
        📎
      </button>
      <span className={`flex-1 truncate text-sm ${fileName ? "text-foreground" : "text-muted"}`}>
        {fileName || "لم يتم اختيار ملف"}
      </span>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
      />
    </div>
  );
}
