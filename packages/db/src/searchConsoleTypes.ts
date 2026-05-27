export const refreshSuggestionStatuses = ["open", "planned", "applied", "dismissed"] as const;

export type RefreshSuggestionStatus = (typeof refreshSuggestionStatuses)[number];

export interface SearchConsoleMetricInput {
  page: string;
  query: string;
  country?: string;
  device?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  startDate?: string;
  endDate?: string;
}

export function isRefreshSuggestionStatus(value: string): value is RefreshSuggestionStatus {
  return refreshSuggestionStatuses.includes(value as RefreshSuggestionStatus);
}
