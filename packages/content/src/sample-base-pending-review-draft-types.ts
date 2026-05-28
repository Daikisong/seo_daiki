import type { Locale } from "@global-import-lab/types";

export interface BasePendingReviewDraftSpec {
  group: string;
  id: string;
  productId: string;
  locale: Locale;
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  sectionHeadings: string[];
  evidenceIds: string[];
  qualityScore: number;
  internalLinkLimit: number;
  affiliateLabel: string;
  affiliateHref: string;
}
