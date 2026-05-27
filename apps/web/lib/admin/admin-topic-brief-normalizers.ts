import {
  isRecord,
  numberFromUnknown,
  numericRecord,
  outlineHeadings,
  stringArrayFromUnknown,
  stringFromUnknown
} from "./admin-section-utils";

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
