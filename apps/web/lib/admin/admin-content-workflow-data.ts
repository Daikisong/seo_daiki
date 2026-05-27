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
import {
  mapDbComplianceArticleRow,
  mapDbContentBriefRow,
  mapDbLocalizationGroupRow,
  mapDbPublishingJobRow,
  mapDbTopicRow,
  mapDbTrendSignalRow
} from "./admin-section-db-mappers";
import { readAdminJson } from "./admin-section-file-data";
import {
  matchesTrendFilters,
  normalizeContentBriefExportRows,
  normalizeLocalizationExportRows,
  normalizePublishingGateComplianceRows,
  normalizePublishingGateRows,
  normalizeTopicScoreRows,
  normalizeTrendSignalRows
} from "./admin-section-normalizers";

export async function readTrendRows(filters: { country?: string; locale?: string; source?: string }) {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listTrendSignals();
      return rows
        .map(mapDbTrendSignalRow)
        .filter((row) => matchesTrendFilters(row, filters));
    } catch (error) {
      console.warn("Trend signals unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/snapshots/trend_signals.json");
  return normalizeTrendSignalRows(trendSignalPayloadRows(payload), filters);
}

export async function readTopicRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listTopics();
      return rows.map(mapDbTopicRow);
    } catch (error) {
      console.warn("Topics unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/snapshots/topic_scores.json");
  return normalizeTopicScoreRows(topicScorePayloadRows(payload));
}

export async function readContentBriefRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listContentBriefs();
      return rows.map(mapDbContentBriefRow);
    } catch (error) {
      console.warn("Content briefs unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/briefs/content_briefs.json");
  return normalizeContentBriefExportRows(contentBriefPayloadRows(payload));
}

export async function readPublishingJobRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listPublishingJobs();
      return rows.map(mapDbPublishingJobRow);
    } catch (error) {
      console.warn("Publishing jobs unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/exports/topic_publishing_gate.json");
  return normalizePublishingGateRows(publishingGatePayloadRows(payload));
}

export async function readComplianceRows(
  sampleArticles: Article[],
  products: Product[],
  evidencePacks: EvidencePack[]
) {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listComplianceArticles();
      return rows.map(mapDbComplianceArticleRow);
    } catch (error) {
      console.warn("Compliance rows unavailable.", error);
    }
  }

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

export async function readLocalizationRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listLocalizationGroups();
      return rows.map(mapDbLocalizationGroupRow);
    } catch (error) {
      console.warn("Localization groups unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/exports/localized_topic_articles.json");
  return normalizeLocalizationExportRows(localizedArticlePayloadRows(payload));
}
