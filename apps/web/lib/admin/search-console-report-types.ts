export interface SearchConsoleRow {
  page: string;
  query: string;
  country?: string;
  device?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleSuggestion {
  page: string;
  query?: string;
  country?: string;
  device?: string;
  reason?: string;
  priority?: number;
  title_candidate?: string;
  meta_description_candidate?: string;
  diagnostics?: Record<string, unknown>;
  missing_sections?: SearchConsoleMissingSection[];
  internal_link_candidates?: SearchConsoleInternalLinkCandidate[];
  action: string[];
}

export interface SearchConsoleMissingSection {
  heading: string;
  why?: string;
  intent?: string;
  recommended_details?: string[];
}

export interface SearchConsoleInternalLinkCandidate {
  path: string;
  href: string;
  type?: string;
  anchor?: string;
  reason?: string;
  score?: number;
  score_breakdown?: Record<string, number>;
}
