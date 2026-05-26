export const locales = ["en", "es", "pt-br"] as const;
export type Locale = (typeof locales)[number];

export type MarketCode =
  | "us"
  | "gb"
  | "ca"
  | "au"
  | "es"
  | "mx"
  | "br"
  | "pt"
  | "fr"
  | "de"
  | "it"
  | "nl"
  | "pl"
  | "tr"
  | "id"
  | "jp"
  | "kr"
  | "in";

export interface MarketConfig {
  market: MarketCode;
  language: string;
  country: string;
  currency: string;
  timezone: string;
  trendsGeo: string;
  serpGl: string;
  serpHl: string;
  pathPrefix: string;
  enabled: boolean;
  monetizationReadiness: "research_only" | "candidate_analysis" | "review_ready" | "approved";
  defaultCategories: string[];
  blockedCategories: string[];
  searchConsoleCountryFilter: string;
  serpLocaleConfig: { gl: string; hl: string };
  localizationRules: string[];
  trendFeedPath: string;
  editorialCalendarPath: string;
}

export interface MarketTrendSignal {
  id: string;
  sourceId: string;
  sourceType: string;
  market: string;
  language: string;
  country: string;
  rawKeyword: string;
  normalizedKeyword: string;
  topicRaw: string;
  categoryGuess: string;
  url?: string;
  observedAt: string;
  sourceRank: number;
  sourceVolumeBucket: string;
  relativeGrowth: number;
  velocityScore: number;
  freshnessScore: number;
  commercialHintScore: number;
  evidenceHintScore: number;
  localeSpecificityScore: number;
  status: "raw" | "normalized" | "clustered" | "scored" | "keyword_ready" | "serp_pending" | "brief_pending" | "drafted" | "testing" | "rejected";
  rawJson?: Record<string, unknown>;
}

export interface TrendClusterRecord {
  id: string;
  market: string;
  language: string;
  canonicalTopic: string;
  slug: string;
  category: string;
  detectedAt: string;
  status: string;
  signalCount: number;
  countriesSeenJson: string[];
  relatedKeywordsJson: string[];
  score: number;
  scoreBreakdownJson: Record<string, number>;
}

export interface TrendKeywordRecord {
  id: string;
  clusterId: string;
  market: string;
  language: string;
  keyword: string;
  searchIntentGuess: string;
  priorityScore: number;
  serpStatus: string;
  status: string;
}

export interface TestArticleRecord {
  id: string;
  strategyId: string;
  market: string;
  language: string;
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  status: "draft" | "test_pending" | "test_published_noindex" | "test_published_index_candidate" | "performance_monitoring" | "needs_product_analysis" | "approved_for_monetization" | "rejected";
  indexStatus: IndexStatus;
  publishStatus: PublishStatus;
  sections: ArticleSection[];
  productCandidateState: "pending" | "ready" | "approved";
}

export interface SerpKeywordOpportunityRecord {
  id: string;
  keywordId: string;
  market: string;
  language: string;
  keyword: string;
  opportunityScore: number;
  dominantIntent: string;
  dominantContentTypesJson: string[];
  topPatternsJson: string[];
  contentGapJson: Record<string, unknown>;
  recommendedAngle: string;
  recommendedArticleType: string;
  shouldWrite: boolean;
  reason: string;
}

export interface ContentStrategyRecord {
  id: string;
  keywordId: string;
  clusterId: string;
  market: string;
  language: string;
  slug: string;
  selectedArticleType: string;
  recommendedAngle: string;
  titleStrategy: string;
  sectionPlanJson: Array<Record<string, unknown>>;
  evidenceNeededJson: string[];
  monetizationDeferred: boolean;
  status: string;
}

export interface ProductCandidateRecord {
  id: string;
  articleId?: string;
  market: string;
  language: string;
  sourceMerchant: string;
  sourceMode: string;
  title: string;
  productUrl?: string;
  candidateUrl?: string;
  category?: string;
  priceText?: string;
  currency?: string;
  reason: string;
  relevanceScore: number;
  riskScore: number;
  evidenceNeededJson: string[];
  status: string;
}

export interface MonetizationReviewRecord {
  id: string;
  articleId: string;
  market: string;
  language: string;
  productAnalysisId: string;
  status: "pending_human_review" | "approved_candidates" | "final_approved" | "rejected";
  reviewerNotes?: string;
  approvedCandidateIdsJson: string[];
  rejectedCandidateIdsJson: string[];
}

export type ArticleType =
  | "hub"
  | "review"
  | "guide"
  | "compare"
  | "data"
  | "lab"
  | "risk"
  | "methodology"
  | "trend"
  | "buyer_guide"
  | "deal_watch"
  | "ingredient_guide";

export type IndexStatus =
  | "index"
  | "noindex"
  | "pending"
  | "refresh_needed"
  | "merge_candidate";

export type PublishStatus = "draft" | "pending" | "published";
export type HealthSensitivity = "none" | "low" | "medium" | "high";
export type ComplianceStatus = "unchecked" | "passed" | "blocked" | "manual_required";

export interface Variant {
  id: string;
  productId: string;
  sourceSku?: string;
  optionName: string;
  wattageClaim?: number;
  plugType?: string;
  cableIncluded?: boolean;
  sourceUrl: string;
  affiliateUrl?: string;
  sellerName?: string;
  sellerId?: string;
  riskFlags?: string[];
}

export interface SellerClaim {
  id: string;
  productId: string;
  claimType: string;
  claimValue: string;
  rawText?: string;
  sourceUrl?: string;
  capturedAt: string;
  confidence: number;
}

export interface VerifiedClaim {
  id: string;
  productId: string;
  testType: string;
  resultValue: string;
  unit?: string;
  method: string;
  evidenceUrl?: string;
  confidence: number;
  testedAt?: string;
}

export interface ReviewSignal {
  id: string;
  productId: string;
  locale: Locale;
  topic: string;
  sentiment: "positive" | "neutral" | "negative";
  count: number;
  confidence: number;
  window?: string;
}

export interface PriceSnapshot {
  id: string;
  productId: string;
  variantId?: string;
  country?: string;
  currency: string;
  price: number;
  shipping?: number;
  coupon?: number;
  finalPrice?: number;
  capturedAt: string;
}

export interface MarketRisk {
  id: string;
  productId: string;
  locale: Locale;
  country?: string;
  plugRisk?: string;
  customsRisk?: string;
  certificationRisk?: string;
  returnRisk?: string;
  localAlternativeNote?: string;
  score: number;
}

export interface Product {
  id: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim?: string;
  identityConfidence: number;
  imageHash?: string;
  variants: Variant[];
  sellerClaims: SellerClaim[];
  verifiedClaims: VerifiedClaim[];
  reviewSignals: ReviewSignal[];
  priceSnapshots: PriceSnapshot[];
  marketRisks: MarketRisk[];
}

export interface EvidencePack {
  id: string;
  productId?: string;
  locale: Locale;
  packJson: {
    product?: Pick<Product, "id" | "canonicalName" | "slug" | "category">;
    variants: Variant[];
    sellerClaims: SellerClaim[];
    verifiedClaims: VerifiedClaim[];
    reviewSignals: ReviewSignal[];
    priceSnapshots: PriceSnapshot[];
    marketRisks: MarketRisk[];
    allowedClaims: string[];
    forbiddenClaims: string[];
  };
  createdAt: string;
}

export interface InternalLink {
  label: string;
  href: string;
  reason:
    | "category_hub"
    | "methodology"
    | "data"
    | "compare"
    | "alternative"
    | "guide"
    | "language"
    | "risk"
    | "trend"
    | "deal"
    | "ingredient";
}

export interface AffiliateLink {
  label: string;
  href: string;
  rel: string;
  placementId?: string;
  placementStatus?: "draft" | "approved" | "disabled" | "rejected";
  disclosureShown?: boolean;
  offerStatus?: "active" | "inactive" | "expired" | "draft";
  merchantSlug?: string;
  merchantAllowedDomains?: string[];
  offerHealthSensitive?: boolean;
}

export type HreflangMap = Partial<Record<string, string>>;

export interface ArticleSection {
  heading: string;
  body: string;
  evidenceIds?: string[];
}

export interface Article {
  id: string;
  productId?: string;
  locale: Locale;
  slug: string;
  type: ArticleType;
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  sections: ArticleSection[];
  jsonLd?: Record<string, unknown>;
  qualityScore: number;
  indexStatus: IndexStatus;
  publishStatus: PublishStatus;
  healthSensitivity?: HealthSensitivity;
  complianceStatus?: ComplianceStatus;
  complianceJson?: Record<string, unknown>;
  localizationDepthScore?: number;
  translationStatus?: "draft" | "localized" | "approved" | "published";
  canonicalUrl?: string;
  hreflangMap: HreflangMap;
  internalLinks: InternalLink[];
  affiliateLinks: AffiliateLink[];
  evidenceIds: string[];
  lastUpdated: string;
}
