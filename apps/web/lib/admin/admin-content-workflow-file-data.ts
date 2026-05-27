import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "@global-import-lab/validators";
import { buildSampleComplianceRows } from "./admin-compliance-model";
import {
  contentBriefPayloadRows,
  localizedArticlePayloadRows,
  publishingGatePayloadRows,
  topicScorePayloadRows,
  trendSignalPayloadRows
} from "./admin-section-data-payloads";
import { readAdminJson } from "./admin-section-file-data";
import {
  normalizeContentBriefExportRows,
  normalizeLocalizationExportRows,
  normalizePublishingGateComplianceRows,
  normalizePublishingGateRows,
  normalizeTopicScoreRows,
  normalizeTrendSignalRows
} from "./admin-section-normalizers";
import type { TrendRowFilters } from "./admin-content-workflow-db-data";

export async function readTrendExportRows(filters: TrendRowFilters) {
  const payload = await readAdminJson("data/snapshots/trend_signals.json");
  return normalizeTrendSignalRows(trendSignalPayloadRows(payload), filters);
}

export async function readTopicExportRows() {
  const payload = await readAdminJson("data/snapshots/topic_scores.json");
  return normalizeTopicScoreRows(topicScorePayloadRows(payload));
}

export async function readContentBriefExportRows() {
  const payload = await readAdminJson("data/briefs/content_briefs.json");
  return normalizeContentBriefExportRows(contentBriefPayloadRows(payload));
}

export async function readPublishingJobExportRows() {
  const payload = await readAdminJson("data/exports/topic_publishing_gate.json");
  return normalizePublishingGateRows(publishingGatePayloadRows(payload));
}

export async function readComplianceExportRows(
  sampleArticles: Article[],
  products: Product[],
  evidencePacks: EvidencePack[]
) {
  const gatePayload = await readAdminJson("data/exports/topic_publishing_gate.json");
  const generatedRows = normalizePublishingGateComplianceRows(publishingGatePayloadRows(gatePayload));

  const sampleRows = buildSampleComplianceRows({
    evaluateQualityGate: runQualityGate,
    evidencePacks,
    products,
    sampleArticles
  });

  return [...generatedRows, ...sampleRows];
}

export async function readLocalizationExportRows() {
  const payload = await readAdminJson("data/exports/localized_topic_articles.json");
  return normalizeLocalizationExportRows(localizedArticlePayloadRows(payload));
}
