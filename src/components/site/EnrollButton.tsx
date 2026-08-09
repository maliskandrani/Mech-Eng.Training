"use client";

import { useState, useTransition } from "react";
import { enrollSelf } from "@/lib/actions/user-actions";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <div>
      <button
        disabled={pending || done}
        onClick={() =>
          startTransition(async () => {
            const res = await enrollSelf(courseId);
            if (res.ok) {
              setDone(true);
              setMessage("تم تسجيلك في الدورة بنجاح. يمكنك متابعتها من لوحة التحكم.");
            } else {
              setMessage(res.error);
            }
          })
        }
        className="w-full rounded-xl gold-gradient px-6 py-3 text-center font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {done ? "تم التسجيل ✓" : pending ? "جاري التسجيل..." : "التحق بالدورة الآن"}
      </button>
      {message && <p className="mt-2 text-sm text-muted">{message}</p>}
    </div>
  );
}
