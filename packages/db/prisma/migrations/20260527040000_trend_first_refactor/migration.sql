ALTER TABLE "Article" ADD COLUMN "market" TEXT;
ALTER TABLE "Article" ADD COLUMN "language" TEXT;
CREATE INDEX "Article_market_language_publishStatus_idx" ON "Article"("market", "language", "publishStatus");

ALTER TABLE "TrendSource" ADD COLUMN "market" TEXT;
ALTER TABLE "TrendSource" ADD COLUMN "language" TEXT;
ALTER TABLE "TrendSource" ADD COLUMN "reliabilityTier" TEXT NOT NULL DEFAULT 'manual_reviewed';
ALTER TABLE "TrendSource" ADD COLUMN "collectionMode" TEXT NOT NULL DEFAULT 'manual_csv';
ALTER TABLE "TrendSource" ADD COLUMN "lastCollectedAt" TIMESTAMP(3);
CREATE INDEX "TrendSource_market_language_enabled_idx" ON "TrendSource"("market", "language", "enabled");

ALTER TABLE "TrendSignal" ADD COLUMN "market" TEXT;
ALTER TABLE "TrendSignal" ADD COLUMN "language" TEXT;
ALTER TABLE "TrendSignal" ADD COLUMN "rawKeyword" TEXT;
ALTER TABLE "TrendSignal" ADD COLUMN "normalizedKeyword" TEXT;
ALTER TABLE "TrendSignal" ADD COLUMN "categoryGuess" TEXT;
ALTER TABLE "TrendSignal" ADD COLUMN "observedAt" TIMESTAMP(3);
ALTER TABLE "TrendSignal" ADD COLUMN "sourceRank" INTEGER;
ALTER TABLE "TrendSignal" ADD COLUMN "sourceVolumeBucket" TEXT;
ALTER TABLE "TrendSignal" ADD COLUMN "relativeGrowth" DOUBLE PRECISION;
ALTER TABLE "TrendSignal" ADD COLUMN "velocityScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "TrendSignal" ADD COLUMN "commercialHintScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "TrendSignal" ADD COLUMN "evidenceHintScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "TrendSignal" ADD COLUMN "localeSpecificityScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "TrendSignal" ADD COLUMN "rawJson" JSONB;
CREATE INDEX "TrendSignal_market_language_capturedAt_idx" ON "TrendSignal"("market", "language", "capturedAt");

CREATE TABLE "TrendCluster" (
  "id" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "canonicalTopic" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT,
  "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'clustered',
  "signalCount" INTEGER NOT NULL DEFAULT 0,
  "countriesSeenJson" JSONB,
  "relatedKeywordsJson" JSONB,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "scoreBreakdownJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrendCluster_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TrendCluster_market_language_slug_key" ON "TrendCluster"("market", "language", "slug");
CREATE INDEX "TrendCluster_market_language_status_score_idx" ON "TrendCluster"("market", "language", "status", "score");

CREATE TABLE "TrendKeyword" (
  "id" TEXT NOT NULL,
  "clusterId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "keyword" TEXT NOT NULL,
  "searchIntentGuess" TEXT NOT NULL,
  "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "serpStatus" TEXT NOT NULL DEFAULT 'pending',
  "status" TEXT NOT NULL DEFAULT 'serp_pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TrendKeyword_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TrendKeyword_clusterId_idx" ON "TrendKeyword"("clusterId");
CREATE INDEX "TrendKeyword_market_language_status_priorityScore_idx" ON "TrendKeyword"("market", "language", "status", "priorityScore");

CREATE TABLE "SerpSnapshot" (
  "id" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "keywordId" TEXT NOT NULL,
  "keyword" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'imported',
  "rawJson" JSONB,
  "topResultCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SerpSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SerpSnapshot_keywordId_provider_idx" ON "SerpSnapshot"("keywordId", "provider");
CREATE INDEX "SerpSnapshot_market_language_collectedAt_idx" ON "SerpSnapshot"("market", "language", "collectedAt");

CREATE TABLE "SerpResult" (
  "id" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "rank" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "snippet" TEXT,
  "resultType" TEXT NOT NULL,
  "dateHint" TEXT,
  "isForum" BOOLEAN NOT NULL DEFAULT false,
  "isVideo" BOOLEAN NOT NULL DEFAULT false,
  "isEcommerce" BOOLEAN NOT NULL DEFAULT false,
  "isAffiliateLikely" BOOLEAN NOT NULL DEFAULT false,
  "isPublisher" BOOLEAN NOT NULL DEFAULT false,
  "languageGuess" TEXT,
  "contentFetchedStatus" TEXT NOT NULL DEFAULT 'pending',
  "contentAnalysisStatus" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SerpResult_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SerpResult_snapshotId_rank_idx" ON "SerpResult"("snapshotId", "rank");
CREATE INDEX "SerpResult_domain_idx" ON "SerpResult"("domain");

CREATE TABLE "CompetitorContentAnalysis" (
  "id" TEXT NOT NULL,
  "serpResultId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "keyword" TEXT NOT NULL,
  "pageTitle" TEXT,
  "h1" TEXT,
  "headingsJson" JSONB,
  "wordCountEstimate" INTEGER,
  "contentTypeGuess" TEXT,
  "intentServed" TEXT,
  "monetizationPattern" TEXT,
  "affiliatePattern" TEXT,
  "comparisonTablePresent" BOOLEAN NOT NULL DEFAULT false,
  "productLinksPresent" BOOLEAN NOT NULL DEFAULT false,
  "originalDataPresent" BOOLEAN NOT NULL DEFAULT false,
  "freshnessSignalsJson" JSONB,
  "contentAnglesJson" JSONB,
  "missingAnglesJson" JSONB,
  "strengthsJson" JSONB,
  "weaknessesJson" JSONB,
  "extractionStatus" TEXT NOT NULL DEFAULT 'summary_only',
  "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CompetitorContentAnalysis_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CompetitorContentAnalysis_serpResultId_idx" ON "CompetitorContentAnalysis"("serpResultId");
CREATE INDEX "CompetitorContentAnalysis_market_language_keyword_idx" ON "CompetitorContentAnalysis"("market", "language", "keyword");

CREATE TABLE "SerpKeywordOpportunity" (
  "id" TEXT NOT NULL,
  "keywordId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "opportunityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dominantIntent" TEXT NOT NULL,
  "dominantContentTypesJson" JSONB,
  "topPatternsJson" JSONB,
  "contentGapJson" JSONB,
  "recommendedAngle" TEXT NOT NULL,
  "recommendedArticleType" TEXT NOT NULL,
  "shouldWrite" BOOLEAN NOT NULL DEFAULT false,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SerpKeywordOpportunity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SerpKeywordOpportunity_keywordId_idx" ON "SerpKeywordOpportunity"("keywordId");
CREATE INDEX "SerpKeywordOpportunity_market_language_shouldWrite_opportunityScore_idx" ON "SerpKeywordOpportunity"("market", "language", "shouldWrite", "opportunityScore");

CREATE TABLE "ContentStrategy" (
  "id" TEXT NOT NULL,
  "keywordId" TEXT NOT NULL,
  "clusterId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "selectedArticleType" TEXT NOT NULL,
  "recommendedAngle" TEXT NOT NULL,
  "titleStrategy" TEXT NOT NULL,
  "introStrategy" TEXT,
  "sectionPlanJson" JSONB,
  "differentiationPlanJson" JSONB,
  "evidenceNeededJson" JSONB,
  "competitorPatternsJson" JSONB,
  "contentGapJson" JSONB,
  "monetizationDeferred" BOOLEAN NOT NULL DEFAULT true,
  "status" TEXT NOT NULL DEFAULT 'brief_pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentStrategy_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ContentStrategy_keywordId_idx" ON "ContentStrategy"("keywordId");
CREATE INDEX "ContentStrategy_market_language_status_idx" ON "ContentStrategy"("market", "language", "status");

CREATE TABLE "TestArticle" (
  "id" TEXT NOT NULL,
  "strategyId" TEXT NOT NULL,
  "articleId" TEXT,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'test_pending',
  "noindexReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TestArticle_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TestArticle_strategyId_idx" ON "TestArticle"("strategyId");
CREATE INDEX "TestArticle_market_language_status_idx" ON "TestArticle"("market", "language", "status");

CREATE TABLE "MarketEditorialCalendar" (
  "id" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "weekStart" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "summaryJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MarketEditorialCalendar_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MarketEditorialCalendar_market_language_weekStart_idx" ON "MarketEditorialCalendar"("market", "language", "weekStart");

CREATE TABLE "EditorialSlot" (
  "id" TEXT NOT NULL,
  "calendarId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "priority" INTEGER NOT NULL,
  "clusterId" TEXT,
  "keywordId" TEXT,
  "strategyId" TEXT,
  "articleId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'candidate',
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EditorialSlot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EditorialSlot_calendarId_priority_idx" ON "EditorialSlot"("calendarId", "priority");
CREATE INDEX "EditorialSlot_keywordId_idx" ON "EditorialSlot"("keywordId");

CREATE TABLE "ArticlePerformanceSnapshot" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "dateStart" TIMESTAMP(3) NOT NULL,
  "dateEnd" TIMESTAMP(3) NOT NULL,
  "impressions" INTEGER NOT NULL DEFAULT 0,
  "clicks" INTEGER NOT NULL DEFAULT 0,
  "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "avgPosition" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "queriesJson" JSONB,
  "countriesJson" JSONB,
  "devicesJson" JSONB,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ArticlePerformanceSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ArticlePerformanceSnapshot_articleId_capturedAt_idx" ON "ArticlePerformanceSnapshot"("articleId", "capturedAt");
CREATE INDEX "ArticlePerformanceSnapshot_market_language_idx" ON "ArticlePerformanceSnapshot"("market", "language");

CREATE TABLE "ArticleNextAction" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "payloadJson" JSONB,
  "status" TEXT NOT NULL DEFAULT 'open',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ArticleNextAction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ArticleNextAction_articleId_status_idx" ON "ArticleNextAction"("articleId", "status");
CREATE INDEX "ArticleNextAction_actionType_priority_idx" ON "ArticleNextAction"("actionType", "priority");

CREATE TABLE "ProductCandidate" (
  "id" TEXT NOT NULL,
  "articleId" TEXT,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "sourceMerchant" TEXT NOT NULL,
  "sourceMode" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "productUrl" TEXT,
  "candidateUrl" TEXT,
  "category" TEXT,
  "priceText" TEXT,
  "currency" TEXT,
  "imageUrl" TEXT,
  "reason" TEXT,
  "relevanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "evidenceNeededJson" JSONB,
  "status" TEXT NOT NULL DEFAULT 'analysis_pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductCandidate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductCandidate_articleId_idx" ON "ProductCandidate"("articleId");
CREATE INDEX "ProductCandidate_market_language_status_idx" ON "ProductCandidate"("market", "language", "status");

CREATE TABLE "ProductCandidateAnalysis" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "candidatesJson" JSONB,
  "comparisonJson" JSONB,
  "prosConsJson" JSONB,
  "riskNotesJson" JSONB,
  "recommendedUseJson" JSONB,
  "monetizationReadiness" TEXT NOT NULL DEFAULT 'human_review_required',
  "status" TEXT NOT NULL DEFAULT 'do_not_link_yet',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductCandidateAnalysis_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProductCandidateAnalysis_articleId_idx" ON "ProductCandidateAnalysis"("articleId");
CREATE INDEX "ProductCandidateAnalysis_market_language_status_idx" ON "ProductCandidateAnalysis"("market", "language", "status");

CREATE TABLE "MonetizationReview" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "productAnalysisId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending_human_review',
  "reviewerNotes" TEXT,
  "approvedCandidateIdsJson" JSONB,
  "rejectedCandidateIdsJson" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MonetizationReview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MonetizationReview_articleId_idx" ON "MonetizationReview"("articleId");
CREATE INDEX "MonetizationReview_status_idx" ON "MonetizationReview"("status");

CREATE TABLE "MonetizedPlacementDraft" (
  "id" TEXT NOT NULL,
  "articleId" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "merchant" TEXT NOT NULL,
  "placementType" TEXT NOT NULL,
  "anchorText" TEXT NOT NULL,
  "disclosureText" TEXT NOT NULL,
  "rel" TEXT NOT NULL DEFAULT 'sponsored nofollow',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MonetizedPlacementDraft_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MonetizedPlacementDraft_articleId_status_idx" ON "MonetizedPlacementDraft"("articleId", "status");
CREATE INDEX "MonetizedPlacementDraft_candidateId_idx" ON "MonetizedPlacementDraft"("candidateId");
