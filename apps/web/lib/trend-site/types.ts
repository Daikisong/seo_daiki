import type { Locale } from "./locales";

export type { Locale };

export type ArticleType = "trend";

export type EvidenceLevel = "direct-use" | "review-pattern" | "public-spec" | "insufficient";

export type AffiliateLink = {
  label: string;
  href: string;
  rel: string;
  linkType?: "affiliate-deep-link" | "merchant-product-page" | "marketplace-search-route";
  placementStatus?: "approved";
  offerStatus?: "active" | "inactive";
};

export type ArticleSection = {
  role?: "quick-answer";
  heading: string;
  body: string;
  evidenceIds?: string[];
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleSignalBox = {
  heading: string;
  body: string;
  items: Array<{
    label: string;
    body: string;
  }>;
  sourceNote?: string;
};

export type ArticleMarketplaceRule = {
  heading: string;
  body: string;
  bullets: string[];
};

export type ArticleCountryRoute = {
  market: string;
  route: string;
};

export type ArticleAvoidItem = {
  label: string;
  reason: string;
};

export type ArticleExpertCopy = {
  topPicksHeading: string;
  topPicksIntro: string;
  topPicksRule: string;
  comparisonHeading: string;
  comparisonIntro: string;
  comparisonFootnote: string;
  inDepthHeading: string;
  topThreeHeading: string;
  finalThoughtsHeading: string;
  finalThoughts: string[];
  buyingChecklistHeading: string;
  buyingChecklist: string[];
  updateLogHeading: string;
  updateLog: string[];
};

export type Article = {
  id: string;
  locale: Locale;
  slug: string;
  type: ArticleType;
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  affiliateDisclosure: string;
  imageUrl: string;
  productCategory?: string;
  contentMdx: string;
  trendSignalBox?: ArticleSignalBox;
  marketplaceRule?: ArticleMarketplaceRule;
  countryBuyingRoutes?: ArticleCountryRoute[];
  avoidListHeading?: string;
  avoidList?: ArticleAvoidItem[];
  targetRegion?: string;
  requiresCountryBuyingRoutes?: boolean;
  requiresAvoidList?: boolean;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  expertCopy: ArticleExpertCopy;
  evidenceIds: string[];
  affiliateLinks: AffiliateLink[];
  localization?: {
    clusterId: string;
    xDefault?: boolean;
  };
  lastUpdated: string;
  indexStatus: "index" | "noindex";
  publishStatus: "published";
};

export type Product = {
  id: string;
  canonicalName: string;
  exactVariant: string;
  category: string;
  productRole: "main" | "accessory";
  brandClaim?: string;
  merchantUrl: string;
  merchantUrlKind: "affiliate-deep-link" | "merchant-product-page" | "marketplace-search-route";
  sourceUrl: string;
  sourceLabel: string;
  reviewSourceUrl: string;
  reviewSourceLabel: string;
  marketplaceSourceLabel: string;
  priceCheckedAt: string;
  imageUrl: string;
  imageAlt: string;
  priceLabel: string;
  productKind?: string;
  regionFit: string;
  coolingCapacity?: string;
  hoseType?: string;
  noiseLevel?: string;
  roomSize?: string;
  voltagePlug?: string;
  returnRiskLabel: string;
  evidenceLevel: EvidenceLevel;
  evidenceBasis: string;
  specSummary: string;
  reviewSummary: string;
  safetyNote: string;
  bestFor: string;
  whyRecommend: string;
  whoFits: string;
  whoShouldSkip: string;
  repeatedComplaints: string[];
  warrantyReturnNote: string;
  marketplaceNote: string;
  keyCheck: string;
  keyFeatures: string[];
  editorialRankLabel: string;
  expertReviewTake: string;
  editorialPros: string[];
  editorialCons: string[];
  verifiedClaims: Array<{
    id: string;
    productId: string;
    testType: string;
    resultValue: string;
    unit?: string;
    exactVariant?: string;
    usageWindow?: string;
    originalNote?: string;
  }>;
  priceSnapshots: Array<{
    id: string;
    productId: string;
    country: string;
    currency: string;
    price: number;
    finalPrice?: number;
  }>;
  reviewSignals: Array<{
    id: string;
    productId: string;
    locale: Locale;
    topic: string;
    count: number;
  }>;
  marketRisks: Array<{
    id: string;
    productId: string;
    locale: Locale;
    country: string;
    certificationRisk: string;
    returnRisk: string;
  }>;
};
