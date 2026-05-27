import { isRecord, numberFromUnknown, stringFromUnknown } from "./admin-section-utils";

export function normalizeAffiliatePlacementCandidateRows(rows: unknown[]) {
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
}
