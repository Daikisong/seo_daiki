import { isRecord, numericRecord, outlineHeadings, stringArrayFromUnknown } from "./admin-section-utils";
import type { ContentBriefRow, TopicRow, TrendSignalRow } from "./admin-section-db-row-types";

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
