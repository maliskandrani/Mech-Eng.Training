import { NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import path from "path";
import { prisma } from "@/lib/prisma";
import { canAccessCourseMaterials } from "@/lib/access";
import { resolveMaterialPath } from "@/lib/storage";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ materialId: string }> }
) {
  const { materialId } = await params;

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: { module: { select: { courseId: true } } },
  });
  if (!material) return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });

  const allowed = await canAccessCourseMaterials(material.module.courseId);
  if (!allowed) return NextResponse.json({ error: "غير مصرح لك بالوصول لهذا الملف" }, { status: 403 });

  const filePath = resolveMaterialPath(material.fileUrl);
  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    return NextResponse.json({ error: "الملف غير موجود على الخادم" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;

  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Content-Disposition": `inline; filename="${encodeURIComponent(material.title)}${ext}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
