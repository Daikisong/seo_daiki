export interface DateLike {
  toISOString(): string;
}

export type AuditLogRow = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string | null;
  summary: string | null;
  createdAt: DateLike;
};

export type TrendSignalRow = {
  id: string;
  locale: string;
  country: string | null;
  query: string;
  topicRaw: string;
  growthScore: number;
  commercialScore: number;
  evidenceFitScore: number;
  affiliateFitScore: number;
  source: { name: string };
};

export type TopicRow = {
  id: string;
  canonicalTopic: string;
  slug: string;
  intent: string;
  healthSensitive: boolean;
  primaryLocale: string;
  status: string;
  score: number;
  scoreBreakdown: unknown;
  _count: { topicSignals: number; contentBriefs: number; offers: number };
};

export type ContentBriefRow = {
  id: string;
  topicId: string;
  topic?: { canonicalTopic: string } | null;
  locale: string;
  articleType: string;
  titleCandidate: string;
  searchIntent: string;
  outlineJson: unknown;
  requiredEvidence: unknown;
  status: string;
};

export type PublishingJobRow = {
  id: string;
  locale: string;
  jobType: string;
  status: string;
  articleId: string | null;
  topicId: string | null;
  article?: { title: string } | null;
  topic?: { canonicalTopic: string } | null;
  outputJson: unknown;
  error: string | null;
};

export type ComplianceArticleRow = {
  id: string;
  title: string;
  locale: string;
  type: string;
  slug: string;
  publishStatus: string;
  indexStatus: string;
  healthSensitivity: string;
  complianceStatus: string;
  complianceJson: unknown;
};

export type LocalizationGroupRow = {
  id: string;
  canonicalTopic?: { canonicalTopic: string } | null;
  sourceArticle?: { locale: string; type: string; slug: string } | null;
  variants: Array<{ locale: string; status: string; localizationDepthScore: number }>;
};

export type LabEvidenceAssetRow = {
  id: string;
  productId: string | null;
  verifiedClaimId: string | null;
  measurementType: string;
  fileName: string;
  publicUrl: string;
  sizeBytes: number;
  uploadedAt: DateLike;
};
