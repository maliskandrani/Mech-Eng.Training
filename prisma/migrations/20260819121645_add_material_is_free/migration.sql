-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "durationMinutes" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lessonId" TEXT NOT NULL,
    CONSTRAINT "materials_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_materials" ("createdAt", "durationMinutes", "fileSize", "fileUrl", "id", "lessonId", "order", "title", "type") SELECT "createdAt", "durationMinutes", "fileSize", "fileUrl", "id", "lessonId", "order", "title", "type" FROM "materials";
DROP TABLE "materials";
ALTER TABLE "new_materials" RENAME TO "materials";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
