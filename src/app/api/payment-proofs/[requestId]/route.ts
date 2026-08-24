import { NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import path from "path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { resolveMaterialPath } from "@/lib/storage";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;

  const purchaseRequest = await prisma.purchaseRequest.findUnique({
    where: { id: requestId },
    include: {
      course: { select: { trainerId: true } },
      material: { select: { lesson: { select: { section: { select: { course: { select: { trainerId: true } } } } } } } },
    },
  });
  if (!purchaseRequest) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول للوصول لهذا الملف" }, { status: 401 });
  }

  const receiverId = purchaseRequest.course?.trainerId ?? purchaseRequest.material?.lesson.section.course.trainerId;
  const allowed =
    session.user.role === "ADMIN" ||
    session.user.id === purchaseRequest.userId ||
    session.user.id === receiverId;
  if (!allowed) return NextResponse.json({ error: "غير مصرح لك بالوصول لهذا الملف" }, { status: 403 });

  const filePath = resolveMaterialPath(purchaseRequest.proofUrl);
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
      "Content-Disposition": `inline; filename="payment-proof${ext}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
