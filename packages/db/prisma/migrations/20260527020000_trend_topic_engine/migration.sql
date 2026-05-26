-- CreateTable
CREATE TABLE "TrendSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "locale" TEXT,
    "country" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "configJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendSignal" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "country" TEXT,
    "query" TEXT NOT NULL,
    "topicRaw" TEXT NOT NULL,
    "url" TEXT,
    "volumeScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "growthScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "competitionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commercialScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "freshnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "evidenceFitScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "affiliateFitScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrendSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "canonicalTopic" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cluster" TEXT NOT NULL,
    "primaryLocale" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "healthSensitive" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'candidate',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreBreakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicSignal" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "trendSignalId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "TopicSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBrief" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "articleType" TEXT NOT NULL,
    "titleCandidate" TEXT NOT NULL,
    "h1Candidate" TEXT,
    "searchIntent" TEXT NOT NULL,
    "outlineJson" JSONB NOT NULL,
    "requiredEvidence" JSONB,
    "merchantFitJson" JSONB,
    "localizationNotes" JSONB,
    "healthSensitivity" TEXT NOT NULL DEFAULT 'none',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBrief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrendSource_slug_key" ON "TrendSource"("slug");

-- CreateIndex
CREATE INDEX "TrendSignal_locale_country_capturedAt_idx" ON "TrendSignal"("locale", "country", "capturedAt");

-- CreateIndex
CREATE INDEX "TrendSignal_query_idx" ON "TrendSignal"("query");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "TopicSignal_topicId_idx" ON "TopicSignal"("topicId");

-- CreateIndex
CREATE INDEX "TopicSignal_trendSignalId_idx" ON "TopicSignal"("trendSignalId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicSignal_topicId_trendSignalId_key" ON "TopicSignal"("topicId", "trendSignalId");

-- CreateIndex
CREATE INDEX "ContentBrief_topicId_locale_idx" ON "ContentBrief"("topicId", "locale");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrendSignal" ADD CONSTRAINT "TrendSignal_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TrendSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicSignal" ADD CONSTRAINT "TopicSignal_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicSignal" ADD CONSTRAINT "TopicSignal_trendSignalId_fkey" FOREIGN KEY ("trendSignalId") REFERENCES "TrendSignal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBrief" ADD CONSTRAINT "ContentBrief_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
