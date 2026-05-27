import { normalizeRefreshSuggestionPayload } from "./admin-section-utils";

export function normalizePersistedRefreshSuggestion(row: {
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
