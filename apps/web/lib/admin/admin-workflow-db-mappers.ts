import {
  complianceIssuesFromJson,
  isRecord,
  numericRecord,
  outlineHeadings,
  stringArrayFromUnknown,
  summarizeJson
} from "./admin-section-utils";
import type {
  ComplianceArticleRow,
  ContentBriefRow,
  LocalizationGroupRow,
  PublishingJobRow,
  TopicRow,
  TrendSignalRow
} from "./admin-section-db-row-types";

export function mapDbTrendSignalRow(row: TrendSignalRow) {
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

export function mapDbTopicRow(row: TopicRow) {
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

export function mapDbContentBriefRow(row: ContentBriefRow) {
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

export function mapDbPublishingJobRow(row: PublishingJobRow) {
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

export function mapDbComplianceArticleRow(row: ComplianceArticleRow) {
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

export function mapDbLocalizationGroupRow(row: LocalizationGroupRow) {
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
