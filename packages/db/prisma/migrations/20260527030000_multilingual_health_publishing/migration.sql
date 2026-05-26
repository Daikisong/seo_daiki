-- AlterTable
ALTER TABLE "Article" ADD COLUMN "healthSensitivity" TEXT NOT NULL DEFAULT 'none';
ALTER TABLE "Article" ADD COLUMN "complianceStatus" TEXT NOT NULL DEFAULT 'unchecked';
ALTER TABLE "Article" ADD COLUMN "complianceJson" JSONB;

-- CreateTable
CREATE TABLE "TranslationGroup" (
    "id" TEXT NOT NULL,
    "canonicalTopicId" TEXT,
    "sourceArticleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationVariant" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "sourceLocale" TEXT,
    "localizationDepthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslationVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishingJob" (
    "id" TEXT NOT NULL,
    "topicId" TEXT,
    "articleId" TEXT,
    "locale" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "inputJson" JSONB,
    "outputJson" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishingJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Article_healthSensitivity_complianceStatus_idx" ON "Article"("healthSensitivity", "complianceStatus");

-- CreateIndex
CREATE INDEX "TranslationGroup_canonicalTopicId_idx" ON "TranslationGroup"("canonicalTopicId");

-- CreateIndex
CREATE INDEX "TranslationGroup_sourceArticleId_idx" ON "TranslationGroup"("sourceArticleId");

-- CreateIndex
CREATE INDEX "TranslationVariant_groupId_locale_idx" ON "TranslationVariant"("groupId", "locale");

-- CreateIndex
CREATE INDEX "TranslationVariant_articleId_idx" ON "TranslationVariant"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationVariant_groupId_locale_key" ON "TranslationVariant"("groupId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationVariant_articleId_key" ON "TranslationVariant"("articleId");

-- CreateIndex
CREATE INDEX "PublishingJob_status_jobType_idx" ON "PublishingJob"("status", "jobType");

-- CreateIndex
CREATE INDEX "PublishingJob_articleId_idx" ON "PublishingJob"("articleId");

-- CreateIndex
CREATE INDEX "PublishingJob_topicId_idx" ON "PublishingJob"("topicId");

-- AddForeignKey
ALTER TABLE "TranslationGroup" ADD CONSTRAINT "TranslationGroup_canonicalTopicId_fkey" FOREIGN KEY ("canonicalTopicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationGroup" ADD CONSTRAINT "TranslationGroup_sourceArticleId_fkey" FOREIGN KEY ("sourceArticleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationVariant" ADD CONSTRAINT "TranslationVariant_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "TranslationGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationVariant" ADD CONSTRAINT "TranslationVariant_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishingJob" ADD CONSTRAINT "PublishingJob_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishingJob" ADD CONSTRAINT "PublishingJob_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
