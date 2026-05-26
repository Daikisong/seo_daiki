-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brandClaim" TEXT,
    "identityConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageHash" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sourceSku" TEXT,
    "optionName" TEXT NOT NULL,
    "wattageClaim" INTEGER,
    "plugType" TEXT,
    "cableIncluded" BOOLEAN,
    "sourceUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "sellerName" TEXT,
    "sellerId" TEXT,
    "riskFlags" JSONB,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerClaim" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "claimType" TEXT NOT NULL,
    "claimValue" TEXT NOT NULL,
    "rawText" TEXT,
    "sourceUrl" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "SellerClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifiedClaim" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "resultValue" TEXT NOT NULL,
    "unit" TEXT,
    "method" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "testedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VerifiedClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabEvidenceAsset" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "verifiedClaimId" TEXT,
    "measurementType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "notes" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabEvidenceAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSignal" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "window" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "country" TEXT,
    "currency" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "shipping" DECIMAL(10,2),
    "coupon" DECIMAL(10,2),
    "finalPrice" DECIMAL(10,2),
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketRisk" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "country" TEXT,
    "plugRisk" TEXT,
    "customsRisk" TEXT,
    "certificationRisk" TEXT,
    "returnRisk" TEXT,
    "localAlternativeNote" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "MarketRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidencePack" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "locale" TEXT NOT NULL,
    "packJson" JSONB NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidencePack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "h1" TEXT,
    "metaDescription" TEXT,
    "summary" TEXT,
    "contentMdx" TEXT NOT NULL,
    "sections" JSONB,
    "internalLinks" JSONB,
    "affiliateLinks" JSONB,
    "evidenceIds" JSONB,
    "jsonLd" JSONB,
    "qualityScore" INTEGER NOT NULL DEFAULT 0,
    "indexStatus" TEXT NOT NULL DEFAULT 'pending',
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "canonicalUrl" TEXT,
    "hreflangMap" JSONB,
    "archivedAt" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL,
    "articleId" TEXT,
    "productId" TEXT,
    "variantId" TEXT,
    "locale" TEXT,
    "targetUrl" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "utm" JSONB,

    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchConsoleMetric" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "country" TEXT,
    "device" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "position" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchConsoleMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageRefreshSuggestion" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "query" TEXT,
    "reason" TEXT NOT NULL,
    "actions" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageRefreshSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT,
    "summary" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "SellerClaim_productId_claimType_idx" ON "SellerClaim"("productId", "claimType");

-- CreateIndex
CREATE INDEX "VerifiedClaim_productId_testType_idx" ON "VerifiedClaim"("productId", "testType");

-- CreateIndex
CREATE UNIQUE INDEX "LabEvidenceAsset_storageKey_key" ON "LabEvidenceAsset"("storageKey");

-- CreateIndex
CREATE INDEX "LabEvidenceAsset_productId_measurementType_idx" ON "LabEvidenceAsset"("productId", "measurementType");

-- CreateIndex
CREATE INDEX "LabEvidenceAsset_verifiedClaimId_idx" ON "LabEvidenceAsset"("verifiedClaimId");

-- CreateIndex
CREATE INDEX "ReviewSignal_productId_locale_idx" ON "ReviewSignal"("productId", "locale");

-- CreateIndex
CREATE INDEX "PriceSnapshot_productId_country_capturedAt_idx" ON "PriceSnapshot"("productId", "country", "capturedAt");

-- CreateIndex
CREATE INDEX "MarketRisk_productId_locale_idx" ON "MarketRisk"("productId", "locale");

-- CreateIndex
CREATE INDEX "EvidencePack_productId_locale_idx" ON "EvidencePack"("productId", "locale");

-- CreateIndex
CREATE INDEX "Article_locale_type_indexStatus_idx" ON "Article"("locale", "type", "indexStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Article_locale_slug_type_key" ON "Article"("locale", "slug", "type");

-- CreateIndex
CREATE INDEX "AffiliateClick_productId_locale_idx" ON "AffiliateClick"("productId", "locale");

-- CreateIndex
CREATE INDEX "SearchConsoleMetric_page_query_idx" ON "SearchConsoleMetric"("page", "query");

-- CreateIndex
CREATE INDEX "SearchConsoleMetric_country_device_idx" ON "SearchConsoleMetric"("country", "device");

-- CreateIndex
CREATE INDEX "PageRefreshSuggestion_page_status_idx" ON "PageRefreshSuggestion"("page", "status");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerClaim" ADD CONSTRAINT "SellerClaim_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedClaim" ADD CONSTRAINT "VerifiedClaim_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabEvidenceAsset" ADD CONSTRAINT "LabEvidenceAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabEvidenceAsset" ADD CONSTRAINT "LabEvidenceAsset_verifiedClaimId_fkey" FOREIGN KEY ("verifiedClaimId") REFERENCES "VerifiedClaim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSignal" ADD CONSTRAINT "ReviewSignal_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketRisk" ADD CONSTRAINT "MarketRisk_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidencePack" ADD CONSTRAINT "EvidencePack_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
