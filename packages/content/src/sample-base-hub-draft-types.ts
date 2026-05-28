import type { Article, Locale } from "@global-import-lab/types";

export interface HubDraftSpec {
  group: string;
  id: string;
  locale: Locale;
  slug: string;
  type: "hub";
  title: string;
  h1?: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  sectionHeadings: string[];
  evidenceIds: string[];
  indexStatus?: Article["indexStatus"];
  qualityScore?: number;
}

export interface EnglishCategoryHubDraftInput {
  id: string;
  slug: string;
  title: string;
  summary: string;
  evidenceIds: string[];
  indexStatus?: Article["indexStatus"];
  qualityScore?: number;
}
