export interface SerpKeywordOpportunityRecord {
  id: string;
  keywordId: string;
  market: string;
  language: string;
  keyword: string;
  opportunityScore: number;
  dominantIntent: string;
  dominantContentTypesJson: string[];
  topPatternsJson: string[];
  contentGapJson: Record<string, unknown>;
  recommendedAngle: string;
  recommendedArticleType: string;
  shouldWrite: boolean;
  reason: string;
}
