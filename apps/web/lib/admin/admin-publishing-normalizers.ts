import {
  isRecord,
  stringArrayFromUnknown,
  stringFromUnknown
} from "./admin-section-utils";

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
