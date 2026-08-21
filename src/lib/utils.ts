export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Course/section/lesson titles are entered once in Arabic (optionally with an
 * "(English Name)" suffix) plus an optional standalone English title. Arabic
 * locale always shows the Arabic string as-is; every other locale shows the
 * English title if the admin set one, falling back to the Arabic string.
 */
export function localizedTitle(title: string, titleEn: string | null | undefined, locale: string): string {
  if (locale === "ar") return title;
  return titleEn?.trim() || title;
}

/** Arabic-only prefix abbreviation for a person's designation (e.g. "م. " before their name). */
export const DESIGNATION_PREFIX_AR: Record<string, string> = {
  NONE: "",
  ENGINEER: "م. ",
  DOCTOR: "د. ",
  PROFESSOR: "أ. ",
};

/** Dropdown labels for the designation field, admin-facing (Arabic-only dashboard). */
export const DESIGNATION_LABELS: Record<string, string> = {
  NONE: "بدون",
  ENGINEER: "مهندس",
  DOCTOR: "دكتور",
  PROFESSOR: "أستاذ",
};

/**
 * A person's display name: Arabic locale prefixes the designation abbreviation
 * (م./د./أ.) before their Arabic name; every other locale shows their English
 * name as entered, with no prefix, falling back to the Arabic name.
 */
export function localizedName(
  name: string,
  nameEn: string | null | undefined,
  designation: string,
  locale: string
): string {
  if (locale === "ar") return `${DESIGNATION_PREFIX_AR[designation] ?? ""}${name}`;
  return nameEn?.trim() || name;
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

export function formatPrice(price: number, currency: string = "LYD", locale: string = "ar"): string {
  if (price <= 0) return locale === "ar" ? "مجانًا" : "Free";
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${Math.round(price).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ${symbol}`;
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

const ROLE_LABELS_EN: Record<string, string> = {
  ADMIN: "Admin",
  TRAINER: "Trainer",
  STUDENT: "Student",
};

/** Locale-aware role label for public (non-Arabic-only) pages. */
export function roleLabel(role: string, locale: string): string {
  return locale === "ar" ? (ROLE_LABELS[role] ?? role) : (ROLE_LABELS_EN[role] ?? role);
}

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  BOOK: "كتاب (PDF)",
  VIDEO: "فيديو",
  SLIDE: "سلايدز",
};

export const MATERIAL_TYPE_ICONS: Record<string, string> = {
  BOOK: "📕",
  VIDEO: "🎥",
  SLIDE: "📊",
};

const DURATION_UNITS: Record<string, { hour: string; minute: string }> = {
  ar: { hour: "س", minute: "د" },
  en: { hour: "h", minute: "m" },
  it: { hour: "h", minute: "min" },
  tr: { hour: "sa", minute: "dk" },
  fr: { hour: "h", minute: "min" },
  de: { hour: "Std", minute: "Min" },
};

export function formatDuration(minutes: number | null | undefined, locale: string = "ar"): string | null {
  if (!minutes || minutes <= 0) return null;
  const { hour, minute } = DURATION_UNITS[locale] ?? DURATION_UNITS.en;
  if (minutes < 60) return `${minutes} ${minute}`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} ${hour} ${rest} ${minute}` : `${hours} ${hour}`;
}
