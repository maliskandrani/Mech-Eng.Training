"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/auth-actions";

export default function SimpleAddForm({
  action,
  placeholder,
  buttonLabel,
  compact = false,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  placeholder: string;
  buttonLabel: string;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => action(formData),
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <div className="flex-1">
        <input
          name="title"
          required
          placeholder={placeholder}
          className={`w-full rounded-lg border border-border bg-background text-foreground outline-none focus:border-accent ${
            compact ? "px-3 py-1.5 text-sm" : "px-3 py-2 text-sm"
          }`}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className={`rounded-lg gold-gradient font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60 ${
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
        }`}
      >
        {pending ? "..." : buttonLabel}
      </button>
      {state && !state.ok && <p className="w-full text-xs text-red-300">{state.error}</p>}
    </form>
  );
}
