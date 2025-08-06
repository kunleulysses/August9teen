-- CreateTable
CREATE TABLE "Reality" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "parameters" TEXT NOT NULL,
    "recursionDepth" INTEGER NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schemaVersion" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "RecursionPath" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "recursionDepth" INTEGER NOT NULL,
    "connectionStrength" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schemaVersion" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ConsciousnessField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "recursionDepth" INTEGER NOT NULL,
    "fieldStrength" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schemaVersion" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Metric" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "restoreStatus" TEXT,
    "restoreMessage" TEXT,
    "lastRestoredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_name_key" ON "Snapshot"("name");

-- CreateIndex
CREATE INDEX "Snapshot_status_idx" ON "Snapshot"("status");

-- CreateIndex
CREATE INDEX "Snapshot_lastRestoredAt_idx" ON "Snapshot"("lastRestoredAt");