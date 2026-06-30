import type { QualityGateBlocker } from "./quality-gate";
import type {
  AffiliateLink,
  Article,
  EvidenceLevel,
  Locale,
  Product,
  ProductPriceState,
} from "./types";

export type TrendCandidate = {
  id: string;
  locale: Locale;
  market: string;
  detectedAt: string;
  source: "fixture" | "google-trends" | "manual-csv" | "serp-provider";
  seedKeyword: string;
  trendTitle: string;
  trendUrlHint?: string;
  evidence: Array<{
    sourceLabel: string;
    url?: string;
    observedAt: string;
    note: string;
  }>;
};

export type KeywordExpansion = {
  trendCandidateId: string;
  primaryKeyword: string;
  localKeywords: string[];
  buyerKeywords: string[];
  avoidKeywords: string[];
};

export type SERPObservation = {
  id: string;
  keyword: string;
  locale: Locale;
  observedAt: string;
  url: string;
  title: string;
  sourceType:
    | "blog"
    | "publisher"
    | "retailer"
    | "forum"
    | "video"
    | "official"
    | "other";
  notes: string;
};

export type SERPPatternAnalysis = {
  trendCandidateId: string;
  dominantFormats: string[];
  commonSections: string[];
  gapsToExploit: string[];
  readerQuestions: string[];
};

export type BuyerProblemMap = {
  trendCandidateId: string;
  issueSummary: string;
  buyerProblem: string;
  productCategory: string;
  mustCompare: string[];
  avoidConfusions: string[];
  localFitRequirements: string[];
};

export type CommercialFitReport = {
  trendCandidateId: string;
  status: "eligible" | "needs_review" | "not_commercial";
  monetizableMarketplaces: Array<
    "AliExpress" | "Temu" | "Amazon" | "iHerb" | "Local retailer"
  >;
  affiliateFitNotes: string[];
  riskNotes: string[];
};

export type ProductCandidate = {
  id: string;
  name: string;
  exactVariant: string;
  category: string;
  productRole: "main" | "accessory";
  merchantUrl: string;
  merchantUrlKind: AffiliateLink["linkType"];
  price?: number | null;
  priceLabel: string;
  priceState?: ProductPriceState;
  priceCountry?: string;
  priceCurrency?: string;
  priceCheckedAt?: string;
  evidenceLevel?: EvidenceLevel;
  officialSpecSource?: {
    label: string;
    url: string;
  };
  marketplaceSource?: {
    label: string;
    url: string;
  };
  reviewComplaintSignal?: {
    label: string;
    url: string;
    summary: string;
    count: number;
  };
  localRiskNote?: string;
  returnRiskLabel?: string;
  bestFor: string;
  skipIf: string;
  keyCheck: string;
};

export type EvidenceLedgerItem = {
  id: string;
  productCandidateId?: string;
  trendCandidateId?: string;
  evidenceType:
    | "trend"
    | "official-spec"
    | "marketplace"
    | "price"
    | "review-complaint"
    | "local-risk";
  sourceLabel: string;
  url?: string;
  checkedAt: string;
  summary: string;
};

export type ArticleStrategy = {
  trendCandidateId: string;
  targetLocale: Locale;
  title: string;
  slug: string;
  productCategory: string;
  angle: string;
  introBridge: string;
  requiredSections: string[];
  marketplaceRule: string;
};

export type ArticleDraft = {
  id: string;
  strategyId: string;
  locale: Locale;
  slug: string;
  title: string;
  h1: string;
  summary: string;
  productCategory: string;
  indexStatus: Article["indexStatus"];
  publishStatus: "draft";
  contentBlocks: Array<{
    role:
      | "intro"
      | "quick-answer"
      | "top-picks"
      | "comparison"
      | "checklist"
      | "faq";
    heading: string;
    body: string;
  }>;
  affiliateLinks: AffiliateLink[];
  localization?: {
    clusterId: string;
    coreTrendId: string;
    buyerProblemId: string;
    xDefault?: boolean;
  };
};

export type QualityGateReportStatus = "PASS" | "REPAIR_REQUIRED" | "BLOCKED";

export type PipelineQualityGateResult = {
  status: QualityGateReportStatus;
  canPublish: boolean;
  sourceStatus: string;
  next_step:
    | "manual_publish_review"
    | "repair_and_rerun"
    | "collect_evidence"
    | "fix_hreflang_cluster"
    | "blocked";
  blockers: Array<{
    code: string;
    target: string;
    severity: QualityGateBlocker["severity"];
    message: string;
    repair_action: string;
  }>;
};

export type RepairTask = {
  id: string;
  source: "pipeline" | "quality-gate";
  code: string;
  severity: "repair" | "blocked";
  target: string;
  title: string;
  action: string;
};

export type PublishCandidate = {
  articleDraftId: string;
  canPublish: boolean;
  manualReviewReady: boolean;
  manualOnly: true;
  sitemapAction: "none";
  publicRouteAction: "none";
  hreflangAlternates: Record<string, string>;
  reason: string;
};

export type PipelineArtifacts = {
  run_id: string;
  generated_at: string;
  mode: "dry-run";
  trend_candidate: TrendCandidate;
  keyword_expansion: KeywordExpansion;
  serp_observations: SERPObservation[];
  serp_pattern_analysis: SERPPatternAnalysis;
  buyer_problem_map: BuyerProblemMap;
  commercial_fit_report: CommercialFitReport;
  product_candidates: ProductCandidate[];
  evidence_ledger: EvidenceLedgerItem[];
  article_strategy: ArticleStrategy;
  article_draft: ArticleDraft;
  quality_gate_report: PipelineQualityGateResult;
  repair_tasks: RepairTask[];
  publish_candidate: PublishCandidate;
};

export type ProductCandidateToProductResult = {
  product: Product;
  evidenceLedgerItems: EvidenceLedgerItem[];
  repairTasks: RepairTask[];
};
