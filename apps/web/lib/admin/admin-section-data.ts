import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "@global-import-lab/validators";
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
  complianceIssuesFromJson,
  findProjectRoot,
  isRecord,
  numericRecord,
  outlineHeadings,
  stringArrayFromUnknown,
  summarizeJson
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
    return logs.map((log) => ({
      id: log.id,
      entityType: log.entityType,
      entityId: log.entityId,
      action: log.action,
      actor: log.actor,
      summary: log.summary,
      createdAt: log.createdAt.toISOString()
    }));
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
        .map((row) => ({
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
        }))
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
      return rows.map((row) => ({
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
      }));
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
      return rows.map((row) => ({
        id: row.id,
        topicId: row.topicId,
        topicLabel: row.topic.canonicalTopic,
        locale: row.locale,
        articleType: row.articleType,
        titleCandidate: row.titleCandidate,
        searchIntent: row.searchIntent,
        outline: outlineHeadings(row.outlineJson),
        requiredEvidence: stringArrayFromUnknown(row.requiredEvidence),
        status: row.status,
        dbBacked: true
      }));
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
      return rows.map((row) => ({
        id: row.id,
        locale: row.locale,
        jobType: row.jobType,
        status: row.status,
        targetLabel: row.article?.title ?? row.topic?.canonicalTopic ?? row.articleId ?? row.topicId ?? "-",
        outputSummary: summarizeJson(row.outputJson),
        error: row.error,
        dbBacked: true
      }));
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
      return rows.map((row) => ({
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
      }));
    } catch (error) {
      console.warn("Compliance rows unavailable.", error);
    }
  }

  const gatePayload = await readAdminJson("data/exports/topic_publishing_gate.json");
  const gateRows = isRecord(gatePayload) && Array.isArray(gatePayload.results) ? gatePayload.results : [];
  const generatedRows = normalizePublishingGateComplianceRows(gateRows);

  const issuePrefixes = [
    "health_",
    "unsafe_",
    "localization_",
    "translation_",
    "affiliate_placements_over_limit",
    "affiliate_links_exceed_internal_links",
    "affiliate_placement",
    "merchant_allowlist"
  ];

  const sampleRows = sampleArticles.flatMap((article) => {
    const product = article.productId ? products.find((item) => item.id === article.productId) : undefined;
    const evidencePack = evidencePacks.find((pack) => pack.productId === article.productId && pack.locale === article.locale);
    const gate = runQualityGate({ article, product, evidencePack });
    const relevantIssues = gate.issues.filter((issue) => issuePrefixes.some((prefix) => issue.code.startsWith(prefix)));
    if (
      article.healthSensitivity === "none" &&
      article.complianceStatus === "passed" &&
      relevantIssues.length === 0
    ) {
      return [];
    }
    return [{
      id: article.id,
      title: article.title,
      locale: article.locale,
      type: article.type,
      slug: article.slug,
      publishStatus: article.publishStatus,
      indexStatus: article.indexStatus,
      healthSensitivity: article.healthSensitivity ?? "none",
      complianceStatus: article.complianceStatus ?? "unchecked",
      issues: [...complianceIssuesFromJson(article.complianceJson), ...relevantIssues.map((issue) => issue.code)]
    }];
  }).slice(0, 80);

  return [...generatedRows, ...sampleRows];
}

export async function readLocalizationRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listLocalizationGroups();
      return rows.map((row) => ({
        id: row.id,
        topicLabel: row.canonicalTopic?.canonicalTopic ?? "translation group",
        sourceLabel: row.sourceArticle ? `${row.sourceArticle.locale}/${row.sourceArticle.type}/${row.sourceArticle.slug}` : "-",
        variants: row.variants.map((variant) => ({
          locale: variant.locale,
          status: variant.status,
          localizationDepthScore: variant.localizationDepthScore
        }))
      }));
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
    return rows.map((merchant) => ({
      id: merchant.id,
      name: merchant.name,
      slug: merchant.slug,
      domain: merchant.domain,
      merchantType: merchant.merchantType,
      allowedDomains: stringArrayFromUnknown(merchant.allowedDomains),
      defaultRel: merchant.defaultRel,
      healthSensitive: merchant.healthSensitive,
      enabled: merchant.enabled,
      offerCount: merchant._count.offers,
      clickCount: merchant._count.affiliateClicks
    }));
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
    return rows.map((offer) => ({
      id: offer.id,
      merchantId: offer.merchantId,
      programId: offer.programId,
      productId: offer.productId,
      topicId: offer.topicId,
      title: offer.title,
      description: offer.description,
      url: offer.url,
      affiliateUrl: offer.affiliateUrl,
      merchantSlug: offer.merchant.slug,
      locale: offer.locale,
      country: offer.country,
      category: offer.category,
      evidenceLevel: offer.evidenceLevel,
      healthSensitive: offer.healthSensitive,
      price: offer.price === null ? undefined : String(offer.price),
      currency: offer.currency,
      lastCheckedAt: offer.lastCheckedAt?.toISOString().slice(0, 10),
      status: offer.status,
      placementCount: offer._count.affiliatePlacements,
      clickCount: offer._count.affiliateClicks
    }));
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
    return rows.map((placement) => ({
      id: placement.id,
      placementType: placement.placementType,
      anchorText: placement.anchorText,
      status: placement.status,
      rel: placement.rel,
      disclosureShown: placement.disclosureShown,
      articleTitle: placement.article.title,
      articleLocale: placement.article.locale,
      articleType: placement.article.type,
      articleSlug: placement.article.slug,
      offerTitle: placement.offer.title,
      merchantSlug: placement.offer.merchant.slug,
      clickCount: placement._count.affiliateClicks
    }));
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
    return assets.map((asset) => ({
      id: asset.id,
      productId: asset.productId,
      verifiedClaimId: asset.verifiedClaimId,
      measurementType: asset.measurementType,
      fileName: asset.fileName,
      publicUrl: asset.publicUrl,
      sizeBytes: asset.sizeBytes,
      uploadedAt: asset.uploadedAt.toISOString()
    }));
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
