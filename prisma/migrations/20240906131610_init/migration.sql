/*
  Warnings:

  - Added the required column `keywords` to the `Recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "universes" TEXT NOT NULL,
    "keywords" TEXT NOT NULL
);
INSERT INTO "new_Recommendation" ("id", "type", "universes") SELECT "id", "type", "universes" FROM "Recommendation";
DROP TABLE "Recommendation";
ALTER TABLE "new_Recommendation" RENAME TO "Recommendation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
