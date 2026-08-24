-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN "paymentBankDetails" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "paymentCashOfficeInfo" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "paymentLibyanaInfo" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "paymentLttInfo" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "paymentMadarInfo" TEXT;

-- CreateTable
CREATE TABLE "purchase_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "proofUrl" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "receivedAt" DATETIME,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "materialId" TEXT,
    "receivedById" TEXT,
    "approvedById" TEXT,
    CONSTRAINT "purchase_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "purchase_requests_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "purchase_requests_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "purchase_requests_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "purchase_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
