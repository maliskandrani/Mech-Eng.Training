import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  ar: "العربية",
  en: "English",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "ar",
  localePrefix: "as-needed",
});

/** Prefixes a relative path with the locale segment, matching localePrefix: "as-needed". */
export function localizedHref(locale: string, path: string): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}
