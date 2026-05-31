export type MarketContentSection = "trends" | "keywords" | "serp" | "briefs" | "posts";
export type SluggedMarketItem = { slug: string };

export interface MarketTrendView {
  id: string;
  slug: string;
  title: string;
  keyword: string;
  score: number;
  category: string;
  status: string;
  summary: string;
}

export interface MarketKeywordView {
  id: string;
  slug: string;
  keyword: string;
  intent: string;
  score: number;
  status: string;
}

export interface MarketSerpView {
  id: string;
  slug: string;
  keyword: string;
  dominantIntent: string;
  recommendedAngle: string;
  opportunityScore: number;
  patterns: string[];
}

export interface MarketBriefView {
  id: string;
  slug: string;
  title: string;
  angle: string;
  sections: string[];
  monetizationDeferred: boolean;
}

export interface MarketPostView {
  id: string;
  slug: string;
  title: string;
  status: string;
  summary: string;
  sections: { heading: string; body: string }[];
  heroImage?: {
    src: string;
    alt: string;
    caption: string;
  };
  articleMeta: {
    checkedAt: string;
    readingTime: string;
    reviewer: string;
    basis: string;
  };
  keyTakeaways: string[];
  verdictBox?: {
    label: string;
    body: string;
  };
  prosCons?: {
    pros: string[];
    cons: string[];
  };
  serpReferences: Array<{
    rank: string;
    label: string;
    url: string;
    formatPattern: string;
  }>;
  quickFacts: Array<{ label: string; value: string }>;
  checklist: string[];
  comparisonTable?: {
    title: string;
    columns: string[];
    rows: string[][];
  };
  sourceLinks: Array<{ label: string; url: string; note: string; checkedAt: string }>;
  internalLinks: Array<{ label: string; href: string; note: string }>;
  seoReadinessScore: number;
  monetizationDeferred: boolean;
  productCandidateState: string;
  affiliateLinks: unknown[];
  indexStatus: string;
  publishStatus: string;
}
