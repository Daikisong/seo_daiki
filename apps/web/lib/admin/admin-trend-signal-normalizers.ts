import {
  isRecord,
  numberFromUnknown,
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
