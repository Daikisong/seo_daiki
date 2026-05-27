import {
  isRecord,
  numberFromUnknown,
  numericRecord,
  outlineHeadings,
  stringArrayFromUnknown,
  stringFromUnknown
} from "./admin-section-utils";

export function normalizeTrendSignalRows(
  rows: unknown[],
  filters: { country?: string; locale?: string; source?: string }
) {
  return rows.flatMap((row) => {
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
    return matchesTrendFilters(item, filters) ? [item] : [];
  });
}

export function matchesTrendFilters(
  row: { country?: string | null; locale?: string; sourceName?: string },
  filters: { country?: string; locale?: string; source?: string }
) {
  return (
    (!filters.locale || row.locale === filters.locale) &&
    (!filters.country || row.country === filters.country) &&
    (!filters.source || row.sourceName?.toLowerCase().includes(filters.source.toLowerCase()))
  );
}

export function normalizeTopicScoreRows(rows: unknown[]) {
  return rows.flatMap((row) => {
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

export function normalizeContentBriefExportRows(rows: unknown[]) {
  return rows.flatMap((row) => {
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

export function normalizePublishingGateRows(rows: unknown[]) {
  return rows.flatMap((row) => {
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

export function normalizePublishingGateComplianceRows(rows: unknown[]) {
  return rows.flatMap((row) => {
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
}

export function normalizeLocalizationExportRows(rows: unknown[]) {
  return rows.flatMap((row) => {
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
