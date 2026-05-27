import {
  isRecord,
  numberFromUnknown,
  stringFromUnknown
} from "./admin-section-utils";

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
