import type { ArticleSection, IndexStatus, PublishStatus } from "./articles";

export interface TestArticleRecord {
  id: string;
  strategyId: string;
  market: string;
  language: string;
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  status:
    | "draft"
    | "test_pending"
    | "test_published_noindex"
    | "test_published_index_candidate"
    | "performance_monitoring"
    | "needs_product_analysis"
    | "approved_for_monetization"
    | "rejected";
  indexStatus: IndexStatus;
  publishStatus: PublishStatus;
  sections: ArticleSection[];
  productCandidateState: "pending" | "ready" | "approved";
}

export interface ContentStrategyRecord {
  id: string;
  keywordId: string;
  clusterId: string;
  market: string;
  language: string;
  slug: string;
  selectedArticleType: string;
  recommendedAngle: string;
  titleStrategy: string;
  sectionPlanJson: Array<Record<string, unknown>>;
  evidenceNeededJson: string[];
  monetizationDeferred: boolean;
  status: string;
}
