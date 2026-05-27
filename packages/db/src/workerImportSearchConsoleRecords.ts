import { numberValue, refreshSuggestionPayload, stringValue } from "./workerImportParsing";

export function searchConsoleMetricInput(row: Record<string, unknown>) {
  return {
    page: stringValue(row.page),
    query: stringValue(row.query),
    country: stringValue(row.country) || undefined,
    device: stringValue(row.device) || undefined,
    clicks: numberValue(row.clicks) ?? 0,
    impressions: numberValue(row.impressions) ?? 0,
    ctr: numberValue(row.ctr) ?? 0,
    position: numberValue(row.position) ?? 0,
    startDate: stringValue(row.start_date) || stringValue(row.startDate) || undefined,
    endDate: stringValue(row.end_date) || stringValue(row.endDate) || undefined
  };
}

export function refreshSuggestionInput(row: Record<string, unknown>) {
  return {
    page: stringValue(row.page),
    query: stringValue(row.query) || undefined,
    reason: stringValue(row.reason) || "Search Console underperformance",
    actions: refreshSuggestionPayload(row)
  };
}
