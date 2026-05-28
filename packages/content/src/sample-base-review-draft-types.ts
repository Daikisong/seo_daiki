import type { Locale } from "@global-import-lab/types";

export interface BaseReviewDraftSpec {
  group: string;
  id: string;
  productId: string;
  locale: Locale;
  slug: string;
  type: "review";
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  sectionHeadings: string[];
  evidenceIds: string[];
  qualityScore: number;
  affiliateLabel: string;
  affiliateHref: string;
}
