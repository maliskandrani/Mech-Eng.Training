export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPrice(price: number): string {
  if (price <= 0) return "مجانًا";
  return `${price.toLocaleString("ar-EG")} ر.س`;
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
