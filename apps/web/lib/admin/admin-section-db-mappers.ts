import {
  complianceIssuesFromJson,
  isRecord,
  numericRecord,
  outlineHeadings,
  stringArrayFromUnknown,
  summarizeJson
} from "./admin-section-utils";

interface DateLike {
  toISOString(): string;
}

export function mapAuditLogRow(log: {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string | null;
  summary: string | null;
  createdAt: DateLike;
}) {
  return {
    id: log.id,
    entityType: log.entityType,
    entityId: log.entityId,
    action: log.action,
    actor: log.actor,
    summary: log.summary,
    createdAt: log.createdAt.toISOString()
  };
}

export function mapDbTrendSignalRow(row: {
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
}) {
  return {
    id: row.id,
    locale: row.locale,
    country: row.country,
    query: row.query,
    topicRaw: row.topicRaw,
    growthScore: row.growthScore,
    commercialScore: row.commercialScore,
    evidenceFitScore: row.evidenceFitScore,
    affiliateFitScore: row.affiliateFitScore,
    sourceName: row.source.name
  };
}

export function mapDbTopicRow(row: {
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
}) {
  return {
    id: row.id,
    canonicalTopic: row.canonicalTopic,
    slug: row.slug,
    intent: row.intent,
    healthSensitive: row.healthSensitive,
    primaryLocale: row.primaryLocale,
    status: row.status,
    score: row.score,
    scoreBreakdown: isRecord(row.scoreBreakdown) ? numericRecord(row.scoreBreakdown) : {},
    signalCount: row._count.topicSignals,
    briefCount: row._count.contentBriefs,
    offerCount: row._count.offers,
    dbBacked: true
  };
}

export function mapDbContentBriefRow(row: {
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
}) {
  return {
    id: row.id,
    topicId: row.topicId,
    topicLabel: row.topic?.canonicalTopic ?? row.topicId,
    locale: row.locale,
    articleType: row.articleType,
    titleCandidate: row.titleCandidate,
    searchIntent: row.searchIntent,
    outline: outlineHeadings(row.outlineJson),
    requiredEvidence: stringArrayFromUnknown(row.requiredEvidence),
    status: row.status,
    dbBacked: true
  };
}

export function mapDbPublishingJobRow(row: {
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
}) {
  return {
    id: row.id,
    locale: row.locale,
    jobType: row.jobType,
    status: row.status,
    targetLabel: row.article?.title ?? row.topic?.canonicalTopic ?? row.articleId ?? row.topicId ?? "-",
    outputSummary: summarizeJson(row.outputJson),
    error: row.error,
    dbBacked: true
  };
}

export function mapDbComplianceArticleRow(row: {
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
}) {
  return {
    id: row.id,
    title: row.title,
    locale: row.locale,
    type: row.type,
    slug: row.slug,
    publishStatus: row.publishStatus,
    indexStatus: row.indexStatus,
    healthSensitivity: row.healthSensitivity,
    complianceStatus: row.complianceStatus,
    issues: complianceIssuesFromJson(row.complianceJson)
  };
}

export function mapDbLocalizationGroupRow(row: {
  id: string;
  canonicalTopic?: { canonicalTopic: string } | null;
  sourceArticle?: { locale: string; type: string; slug: string } | null;
  variants: Array<{ locale: string; status: string; localizationDepthScore: number }>;
}) {
  return {
    id: row.id,
    topicLabel: row.canonicalTopic?.canonicalTopic ?? "translation group",
    sourceLabel: row.sourceArticle ? `${row.sourceArticle.locale}/${row.sourceArticle.type}/${row.sourceArticle.slug}` : "-",
    variants: row.variants.map((variant) => ({
      locale: variant.locale,
      status: variant.status,
      localizationDepthScore: variant.localizationDepthScore
    }))
  };
}

export function mapLabEvidenceAssetRow(asset: {
  id: string;
  productId: string | null;
  verifiedClaimId: string | null;
  measurementType: string;
  fileName: string;
  publicUrl: string;
  sizeBytes: number;
  uploadedAt: DateLike;
}) {
  return {
    id: asset.id,
    productId: asset.productId,
    verifiedClaimId: asset.verifiedClaimId,
    measurementType: asset.measurementType,
    fileName: asset.fileName,
    publicUrl: asset.publicUrl,
    sizeBytes: asset.sizeBytes,
    uploadedAt: asset.uploadedAt.toISOString()
  };
}
