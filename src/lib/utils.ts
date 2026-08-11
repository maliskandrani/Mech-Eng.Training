export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Formats "count noun" with correct Arabic counted-noun agreement (1=singular, 2=dual, 3-10=plural, 11+=singular). */
export function arabicCount(count: number, singular: string, dual: string, plural: string): string {
  const n = Math.abs(count);
  const noun = n === 1 ? singular : n === 2 ? dual : n >= 3 && n <= 10 ? plural : singular;
  return `${count} ${noun}`;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  LYD: "د.ل",
  EGP: "ج.م",
  USD: "$",
};

export function formatPrice(price: number, currency: string = "LYD"): string {
  if (price <= 0) return "مجانًا";
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${price.toLocaleString("ar-EG")} ${symbol}`;
}

export const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدير",
  TRAINER: "مدرب",
  STUDENT: "متدرب",
};

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  BOOK: "كتاب (PDF)",
  VIDEO: "فيديو",
  SLIDE: "سلايدز",
};
