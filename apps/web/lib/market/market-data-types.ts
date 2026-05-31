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
  monetizationDeferred: boolean;
  productCandidateState: string;
  affiliateLinks: unknown[];
  indexStatus: string;
  publishStatus: string;
}
