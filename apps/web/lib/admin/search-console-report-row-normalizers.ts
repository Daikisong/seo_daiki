import type { SearchConsoleRow } from "./search-console-report-types";
import { numberValue } from "./search-console-report-normalizer-values";

export function normalizeRow(row: Partial<SearchConsoleRow>): SearchConsoleRow {
  return {
    page: String(row.page ?? ""),
    query: String(row.query ?? ""),
    country: row.country ? String(row.country) : undefined,
    device: row.device ? String(row.device) : undefined,
    clicks: numberValue(row.clicks),
    impressions: numberValue(row.impressions),
    ctr: numberValue(row.ctr),
    position: numberValue(row.position)
  };
}
