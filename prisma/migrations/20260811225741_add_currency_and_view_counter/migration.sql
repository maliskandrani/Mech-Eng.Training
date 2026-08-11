-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "logoUrl" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'LYD',
    "homeViews" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_site_settings" ("id", "logoUrl") SELECT "id", "logoUrl" FROM "site_settings";
DROP TABLE "site_settings";
ALTER TABLE "new_site_settings" RENAME TO "site_settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
