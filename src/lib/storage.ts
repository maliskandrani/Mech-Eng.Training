import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./storage/uploads";

export const MATERIAL_ACCEPT: Record<"BOOK" | "VIDEO" | "SLIDE", string[]> = {
  BOOK: [".pdf"],
  VIDEO: [".mp4", ".webm", ".mov"],
  SLIDE: [".ppt", ".pptx", ".pdf"],
};

const MAX_SIZE_BYTES: Record<"BOOK" | "VIDEO" | "SLIDE", number> = {
  BOOK: 100 * 1024 * 1024, // 100MB
  VIDEO: 500 * 1024 * 1024, // 500MB
  SLIDE: 150 * 1024 * 1024, // 150MB
};

function sanitizeExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ext;
}

export function assertValidMaterialFile(
  file: File,
  type: "BOOK" | "VIDEO" | "SLIDE"
) {
  const ext = sanitizeExt(file.name);
  if (!MATERIAL_ACCEPT[type].includes(ext)) {
    throw new Error(
      `صيغة الملف غير مسموحة لهذا النوع. الصيغ المسموحة: ${MATERIAL_ACCEPT[type].join(", ")}`
    );
  }
  if (file.size <= 0) {
    throw new Error("الملف فارغ.");
  }
  if (file.size > MAX_SIZE_BYTES[type]) {
    throw new Error(
      `حجم الملف كبير جدًا. الحد الأقصى ${Math.round(MAX_SIZE_BYTES[type] / (1024 * 1024))}MB.`
    );
  }
}

/** Saves an uploaded material file under a private (non-public) storage dir and returns a DB-storable relative key. */
export async function saveMaterialFile(
  file: File,
  courseId: string
): Promise<{ relativeKey: string; size: number }> {
  const ext = sanitizeExt(file.name);
  const safeName = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(/* turbopackIgnore: true */ process.cwd(), UPLOAD_DIR, courseId);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(/* turbopackIgnore: true */ dir, safeName), buffer);

  return { relativeKey: path.posix.join(courseId, safeName), size: buffer.byteLength };
}

export function resolveMaterialPath(relativeKey: string): string {
  return path.join(/* turbopackIgnore: true */ process.cwd(), UPLOAD_DIR, relativeKey);
}

export async function deleteMaterialFile(relativeKey: string): Promise<void> {
  try {
    await unlink(resolveMaterialPath(relativeKey));
  } catch {
    // File may already be gone; ignore.
  }
}

export function assertValidPoster(file: File) {
  const ext = sanitizeExt(file.name);
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    throw new Error("صيغة الصورة غير مسموحة. استخدم JPG أو PNG أو WEBP.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("حجم الصورة كبير جدًا (الحد 10MB).");
  }
}

export async function savePublicImage(
  file: File,
  subdir: string
): Promise<string> {
  const ext = sanitizeExt(file.name);
  const safeName = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "media", subdir);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), buffer);
  return `/media/${subdir}/${safeName}`;
}

export function assertValidPaymentProof(file: File) {
  const ext = sanitizeExt(file.name);
  if (![".jpg", ".jpeg", ".png", ".webp", ".pdf"].includes(ext)) {
    throw new Error("صيغة الملف غير مسموحة. استخدم صورة (JPG/PNG/WEBP) أو PDF.");
  }
  if (file.size <= 0) {
    throw new Error("الملف فارغ.");
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("حجم الملف كبير جدًا (الحد 15MB).");
  }
}

/** Saves a payment-proof upload under the same private storage dir as materials, and returns a DB-storable relative key. */
export async function savePaymentProof(file: File, userId: string): Promise<string> {
  const ext = sanitizeExt(file.name);
  const safeName = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(/* turbopackIgnore: true */ process.cwd(), UPLOAD_DIR, "payment-proofs", userId);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(/* turbopackIgnore: true */ dir, safeName), buffer);

  return path.posix.join("payment-proofs", userId, safeName);
}
