import type { ArticleType, Locale } from "@global-import-lab/types";

export interface BaseDataDraftSpec {
  group: string;
  id: string;
  productId: string;
  locale: Locale;
  slug: string;
  type: Extract<ArticleType, "data" | "lab">;
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  sectionHeadings: string[];
  evidenceIds: string[];
  qualityScore: number;
}
