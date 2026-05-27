import { isRecord, numberValue, stringValue } from "./workerImportValueParsing";

export function refreshSuggestionPayload(row: Record<string, unknown>) {
  return {
    action: Array.isArray(row.action) ? row.action.map((item) => String(item)) : [],
    priority: numberValue(row.priority) ?? undefined,
    country: stringValue(row.country) || undefined,
    device: stringValue(row.device) || undefined,
    diagnostics: isRecord(row.diagnostics) ? row.diagnostics : undefined,
    missing_sections: Array.isArray(row.missing_sections) ? row.missing_sections : [],
    title_candidate: stringValue(row.title_candidate) || undefined,
    meta_description_candidate: stringValue(row.meta_description_candidate) || undefined,
    internal_link_candidates: Array.isArray(row.internal_link_candidates) ? row.internal_link_candidates : []
  };
}
