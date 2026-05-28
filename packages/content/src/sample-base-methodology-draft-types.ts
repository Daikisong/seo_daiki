import type { Locale } from "@global-import-lab/types";

export interface BaseMethodologyDraftSpec {
  group: string;
  id: string;
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
}
