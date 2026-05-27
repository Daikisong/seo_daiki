import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "@global-import-lab/validators";
import { affiliateMerchantRow, affiliateOfferRow, affiliatePlacementRow } from "./admin-affiliate-row-model";
import { buildSampleComplianceRows } from "./admin-compliance-model";
import {
  mapAuditLogRow,
  mapDbComplianceArticleRow,
  mapDbContentBriefRow,
  mapDbLocalizationGroupRow,
  mapDbPublishingJobRow,
  mapDbTopicRow,
  mapDbTrendSignalRow,
  mapLabEvidenceAssetRow
} from "./admin-section-db-mappers";
import {
  duplicateCandidateCountsFromRows,
  matchesTrendFilters,
  normalizeAffiliatePlacementCandidateRows,
  normalizeContentBriefExportRows,
  normalizeLocalizationExportRows,
  normalizePersistedRefreshSuggestion,
  normalizePublishingGateComplianceRows,
  normalizePublishingGateRows,
  normalizeTopicScoreRows,
  normalizeTrendSignalRows
} from "./admin-section-normalizers";
import {
  findProjectRoot,
  isRecord
} from "./admin-section-utils";

export interface AffiliatePlacementCandidateRow {
  id: string;
  topicId: string;
  briefId: string;
  articleId: string;
  offerId: string;
  merchantSlug: string;
  placementType: string;
  anchorText: string;
  rel: string;
  disclosureShown: boolean;
  status: string;
  humanApprovalRequired: boolean;
  offerScore: number;
  reason: string;
  scoreBreakdown: Record<string, number>;
}

export async function readPersistedRefreshSuggestions() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listRefreshSuggestions } = await import("@global-import-lab/db/search-console");
    const rows = await listRefreshSuggestions({ limit: 100 });
    return rows.map((row) => ({
      ...normalizePersistedRefreshSuggestion(row)
    }));
  } catch (error) {
    console.warn("Persisted refresh suggestions unavailable.", error);
    return [];
  }
}

export async function readDuplicateCandidateCounts() {
  const path = join(findProjectRoot(), "data/snapshots/product_identity_graph.json");
  if (!existsSync(path)) {
    return {} as Record<string, number>;
  }

  try {
    const rows = JSON.parse(await readFile(path, "utf-8")) as unknown[];
    return duplicateCandidateCountsFromRows(rows);
  } catch (error) {
    console.warn("Product identity graph unavailable.", error);
    return {} as Record<string, number>;
  }
}

export async function readAuditLogs() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { getAuditLogs } = await import("@global-import-lab/db/admin-mutations");
    const logs = await getAuditLogs(50);
    return logs.map(mapAuditLogRow);
  } catch (error) {
    console.warn("Audit logs unavailable.", error);
    return [];
  }
}

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
  const signals = isRecord(payload) && Array.isArray(payload.signals) ? payload.signals : [];
  return normalizeTrendSignalRows(signals, filters);
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
  const topics = isRecord(payload) && Array.isArray(payload.topics) ? payload.topics : [];
  return normalizeTopicScoreRows(topics);
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
  const briefs = isRecord(payload) && Array.isArray(payload.briefs) ? payload.briefs : [];
  return normalizeContentBriefExportRows(briefs);
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
  const results = isRecord(payload) && Array.isArray(payload.results) ? payload.results : [];
  return normalizePublishingGateRows(results);
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
  const gateRows = isRecord(gatePayload) && Array.isArray(gatePayload.results) ? gatePayload.results : [];
  const generatedRows = normalizePublishingGateComplianceRows(gateRows);

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
  const articles = isRecord(payload) && Array.isArray(payload.articles) ? payload.articles : [];
  return normalizeLocalizationExportRows(articles);
}

export async function readAffiliateMerchants() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliateMerchants } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliateMerchants();
    return rows.map(affiliateMerchantRow);
  } catch (error) {
    console.warn("Affiliate merchants unavailable.", error);
    return [];
  }
}

export async function readAffiliateOffers() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliateOffers } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliateOffers();
    return rows.map(affiliateOfferRow);
  } catch (error) {
    console.warn("Affiliate offers unavailable.", error);
    return [];
  }
}

export async function readAffiliatePlacements() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliatePlacements } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliatePlacements();
    return rows.map(affiliatePlacementRow);
  } catch (error) {
    console.warn("Affiliate placements unavailable.", error);
    return [];
  }
}

export async function readAffiliatePlacementCandidates(): Promise<AffiliatePlacementCandidateRow[]> {
  try {
    const root = findProjectRoot();
    const path = join(root, "data", "exports", "affiliate_placement_candidates.json");
    if (!existsSync(path)) {
      return [];
    }
    const payload: unknown = JSON.parse(await readFile(path, "utf8"));
    const rows: unknown[] = isRecord(payload) && Array.isArray(payload.placementCandidates) ? payload.placementCandidates : [];
    return normalizeAffiliatePlacementCandidateRows(rows);
  } catch (error) {
    console.warn("Affiliate placement candidates unavailable.", error);
    return [];
  }
}

export async function readLabEvidenceAssets() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listLabEvidenceAssets } = await import("@global-import-lab/db/lab-evidence");
    const assets = await listLabEvidenceAssets();
    return assets.map(mapLabEvidenceAssetRow);
  } catch (error) {
    console.warn("Lab evidence assets unavailable.", error);
    return [];
  }
}

async function readAdminJson(relativePath: string) {
  try {
    const path = join(findProjectRoot(), relativePath);
    if (!existsSync(path)) {
      return {};
    }
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    console.warn(`Admin JSON unavailable: ${relativePath}`, error);
    return {};
  }
}
