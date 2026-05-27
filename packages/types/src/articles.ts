import type { Locale } from "./locales";

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
