export const locales = ["en", "es", "pt-br"] as const;
export type Locale = (typeof locales)[number];

export type ArticleType =
  | "hub"
  | "review"
  | "guide"
  | "compare"
  | "data"
  | "lab"
  | "risk"
  | "methodology";

export type IndexStatus =
  | "index"
  | "noindex"
  | "pending"
  | "refresh_needed"
  | "merge_candidate";

export type PublishStatus = "draft" | "pending" | "published";

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
    | "risk";
}

export interface AffiliateLink {
  label: string;
  href: string;
  rel: string;
  placementId?: string;
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
  canonicalUrl?: string;
  hreflangMap: HreflangMap;
  internalLinks: InternalLink[];
  affiliateLinks: AffiliateLink[];
  evidenceIds: string[];
  lastUpdated: string;
}
