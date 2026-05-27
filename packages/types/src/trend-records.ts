export interface MarketTrendSignal {
  id: string;
  sourceId: string;
  sourceType: string;
  market: string;
  language: string;
  country: string;
  rawKeyword: string;
  normalizedKeyword: string;
  topicRaw: string;
  categoryGuess: string;
  url?: string;
  observedAt: string;
  sourceRank: number;
  sourceVolumeBucket: string;
  relativeGrowth: number;
  velocityScore: number;
  freshnessScore: number;
  commercialHintScore: number;
  evidenceHintScore: number;
  localeSpecificityScore: number;
  status:
    | "raw"
    | "normalized"
    | "clustered"
    | "scored"
    | "keyword_ready"
    | "serp_pending"
    | "brief_pending"
    | "drafted"
    | "testing"
    | "rejected";
  rawJson?: Record<string, unknown>;
}

export interface TrendClusterRecord {
  id: string;
  market: string;
  language: string;
  canonicalTopic: string;
  slug: string;
  category: string;
  detectedAt: string;
  status: string;
  signalCount: number;
  countriesSeenJson: string[];
  relatedKeywordsJson: string[];
  score: number;
  scoreBreakdownJson: Record<string, number>;
}

export interface TrendKeywordRecord {
  id: string;
  clusterId: string;
  market: string;
  language: string;
  keyword: string;
  searchIntentGuess: string;
  priorityScore: number;
  serpStatus: string;
  status: string;
}
