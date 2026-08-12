import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCourseManager } from "@/lib/access";
import { assertValidMaterialFile, saveMaterialFile } from "@/lib/storage";
import type { MaterialType } from "@prisma/client";

const VALID_TYPES: MaterialType[] = ["BOOK", "VIDEO", "SLIDE"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const lessonId = String(formData.get("lessonId") ?? "");

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { section: { select: { courseId: true } } },
    });
    if (!lesson) return NextResponse.json({ ok: false, error: "الدرس غير موجود" });
    const courseId = lesson.section.courseId;
    await requireCourseManager(courseId);

    const title = String(formData.get("title") ?? "").trim();
    const type = String(formData.get("type") ?? "") as MaterialType;
    const file = formData.get("file");

    if (title.length < 2) return NextResponse.json({ ok: false, error: "عنوان الملف قصير جدًا" });
    if (!VALID_TYPES.includes(type)) return NextResponse.json({ ok: false, error: "نوع الملف غير صحيح" });
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "يرجى اختيار ملف للرفع" });
    }

    assertValidMaterialFile(file, type);
    const { relativeKey, size } = await saveMaterialFile(file, courseId);

    const count = await prisma.material.count({ where: { lessonId } });
    await prisma.material.create({
      data: {
        lessonId,
        title,
        type,
        fileUrl: relativeKey,
        fileSize: size,
        order: count + 1,
      },
    });

    revalidatePath("/dashboard");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : "حدث خطأ غير متوقع أثناء الرفع",
    });
  }
}
