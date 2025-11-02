-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteName" TEXT NOT NULL,
    "tagline" TEXT,
    "faviconUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);
