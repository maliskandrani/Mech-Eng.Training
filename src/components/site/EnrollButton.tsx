"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { enrollSelf } from "@/lib/actions/user-actions";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const t = useTranslations("courses");
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
              setMessage(t("enrolledMessage"));
            } else {
              setMessage(res.error);
            }
          })
        }
        className="w-full rounded-xl gold-gradient px-6 py-3 text-center font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {done ? t("enrolled") : pending ? t("enrolling") : t("enrollNow")}
      </button>
      {message && <p className="mt-2 text-sm text-muted">{message}</p>}
    </div>
  );
}
