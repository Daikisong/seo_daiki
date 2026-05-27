import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "@global-import-lab/validators";
import {
  complianceIssuesFromJson,
  findProjectRoot,
  isRecord,
  normalizeRefreshSuggestionPayload,
  numberFromUnknown,
  numericRecord,
  outlineHeadings,
  stringArrayFromUnknown,
  stringFromUnknown,
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

function normalizePersistedRefreshSuggestion(row: {
  id: string;
  page: string;
  query: string | null;
  reason: string;
  actions: unknown;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const payload = normalizeRefreshSuggestionPayload(row.actions);
  return {
    id: row.id,
    page: row.page,
    query: row.query,
    reason: row.reason,
    actions: payload.actions,
    priority: payload.priority,
    titleCandidate: payload.titleCandidate,
    metaDescriptionCandidate: payload.metaDescriptionCandidate,
    missingSections: payload.missingSections,
    internalLinkCandidates: payload.internalLinkCandidates,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

export async function readDuplicateCandidateCounts() {
  const path = join(findProjectRoot(), "data/snapshots/product_identity_graph.json");
  if (!existsSync(path)) {
    return {} as Record<string, number>;
  }

  try {
    const rows = JSON.parse(await readFile(path, "utf-8")) as unknown[];
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (!isRecord(row)) {
        continue;
      }
      const canonicalProduct = isRecord(row.canonical_product) ? row.canonical_product : {};
      const productIds = new Set<string>();
      const canonicalProductId = stringFromUnknown(canonicalProduct.product_id);
      if (canonicalProductId) {
        productIds.add(canonicalProductId);
      }
      if (Array.isArray(row.source_product_ids)) {
        for (const productId of row.source_product_ids) {
          const value = stringFromUnknown(productId);
          if (value) {
            productIds.add(value);
          }
        }
      }

      const candidates = Array.isArray(row.duplicate_candidates) ? row.duplicate_candidates : [];
      const actionableCount = candidates.filter((candidate) => {
        if (!isRecord(candidate)) {
          return false;
        }
        const decision = stringFromUnknown(candidate.decision);
        const confidence = numberFromUnknown(candidate.confidence);
        return decision !== "keep_separate" || confidence >= 0.5;
      }).length;

      for (const productId of productIds) {
        counts[productId] = actionableCount;
      }
    }
    return counts;
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
  const matchesFilters = (row: { country?: string | null; locale?: string; sourceName?: string }) =>
    (!filters.locale || row.locale === filters.locale) &&
    (!filters.country || row.country === filters.country) &&
    (!filters.source || row.sourceName?.toLowerCase().includes(filters.source.toLowerCase()));

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
        .filter(matchesFilters);
    } catch (error) {
      console.warn("Trend signals unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/snapshots/trend_signals.json");
  const signals = isRecord(payload) && Array.isArray(payload.signals) ? payload.signals : [];
  return signals.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const item = {
      id: stringFromUnknown(row.id),
      locale: stringFromUnknown(row.locale),
      country: stringFromUnknown(row.country),
      query: stringFromUnknown(row.query),
      topicRaw: stringFromUnknown(row.topicRaw),
      growthScore: numberFromUnknown(row.growthScore),
      commercialScore: numberFromUnknown(row.commercialScore),
      evidenceFitScore: numberFromUnknown(row.evidenceFitScore),
      affiliateFitScore: numberFromUnknown(row.affiliateFitScore),
      sourceName: stringFromUnknown(row.sourceId) || "manual_csv"
    };
    return matchesFilters(item) ? [item] : [];
  });
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
  return topics.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.id),
        canonicalTopic: stringFromUnknown(row.canonicalTopic),
        slug: stringFromUnknown(row.slug),
        intent: stringFromUnknown(row.intent),
        healthSensitive: row.healthSensitive === true,
        primaryLocale: stringFromUnknown(row.primaryLocale) || "en",
        status: stringFromUnknown(row.status) || "candidate",
        score: numberFromUnknown(row.score),
        scoreBreakdown: isRecord(row.scoreBreakdown) ? numericRecord(row.scoreBreakdown) : {},
        signalCount: numberFromUnknown(row.signalCount),
        briefCount: 0,
        offerCount: 0,
        dbBacked: false
      }
    ];
  });
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
  return briefs.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.id),
        topicId: stringFromUnknown(row.topicId),
        topicLabel: stringFromUnknown(row.topicId),
        locale: stringFromUnknown(row.locale),
        articleType: stringFromUnknown(row.articleType),
        titleCandidate: stringFromUnknown(row.titleCandidate),
        searchIntent: stringFromUnknown(row.searchIntent),
        outline: outlineHeadings(row.outlineJson),
        requiredEvidence: stringArrayFromUnknown(row.requiredEvidence),
        status: stringFromUnknown(row.status) || "draft",
        dbBacked: false
      }
    ];
  });
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
  return results.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const blockers = stringArrayFromUnknown(row.blockers);
    return [
      {
        id: stringFromUnknown(row.articleId),
        locale: stringFromUnknown(row.locale),
        jobType: "publishing-gate",
        status: stringFromUnknown(row.status),
        targetLabel: stringFromUnknown(row.articleId),
        outputSummary: blockers.length ? blockers.join(", ") : "ready for manual review",
        error: "",
        dbBacked: false
      }
    ];
  });
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
  const generatedRows = gateRows.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const blockers = stringArrayFromUnknown(row.blockers);
    if (blockers.length === 0) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.articleId),
        title: stringFromUnknown(row.articleId),
        locale: stringFromUnknown(row.locale),
        type: stringFromUnknown(row.type),
        slug: stringFromUnknown(row.articleId),
        publishStatus: stringFromUnknown(row.publishStatus),
        indexStatus: stringFromUnknown(row.indexStatus),
        healthSensitivity: "",
        complianceStatus: stringFromUnknown(row.status),
        issues: blockers
      }
    ];
  });

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
  return articles.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const sourceArticleId = stringFromUnknown(row.sourceArticleId);
    return [
      {
        id: sourceArticleId || stringFromUnknown(row.id),
        topicLabel: stringFromUnknown(row.topicId) || "localized draft",
        sourceLabel: sourceArticleId,
        variants: [
          {
            locale: stringFromUnknown(row.locale),
            status: stringFromUnknown(row.translationStatus) || stringFromUnknown(row.publishStatus),
            localizationDepthScore: numberFromUnknown(row.localizationDepthScore)
          }
        ]
      }
    ];
  });
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
    return rows.flatMap((row) => {
      if (!isRecord(row)) {
        return [];
      }
      const id = stringFromUnknown(row.id);
      if (!id) {
        return [];
      }
      return [
        {
          id,
          topicId: stringFromUnknown(row.topicId),
          briefId: stringFromUnknown(row.briefId),
          articleId: stringFromUnknown(row.articleId),
          offerId: stringFromUnknown(row.offerId),
          merchantSlug: stringFromUnknown(row.merchantSlug),
          placementType: stringFromUnknown(row.placementType),
          anchorText: stringFromUnknown(row.anchorText),
          rel: stringFromUnknown(row.rel),
          disclosureShown: row.disclosureShown === true,
          status: stringFromUnknown(row.status),
          humanApprovalRequired: row.humanApprovalRequired !== false,
          offerScore: numberFromUnknown(row.offerScore),
          reason: stringFromUnknown(row.reason),
          scoreBreakdown: isRecord(row.scoreBreakdown)
            ? Object.fromEntries(Object.entries(row.scoreBreakdown).map(([key, value]) => [key, numberFromUnknown(value)]))
            : {}
        }
      ];
    });
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
