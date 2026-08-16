"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, LOCALE_LABELS, type AppLocale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleChange(nextLocale: string) {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale as AppLocale });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent"
      >
        <span aria-hidden>🌐</span>
        <span>{LOCALE_LABELS[locale as AppLocale]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-1.5 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-background-card shadow-lg end-0">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => handleChange(l)}
              className={`block w-full px-4 py-2 text-start text-sm transition ${
                l === locale
                  ? "bg-accent/10 font-semibold text-accent-soft"
                  : "text-foreground hover:bg-background-elevated"
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
