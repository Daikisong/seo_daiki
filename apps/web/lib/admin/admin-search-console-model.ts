import type {
  SearchConsoleInternalLinkCandidate,
  SearchConsoleMissingSection,
  SearchConsoleRow,
  SearchConsoleSuggestion
} from "./search-console-report";

export function searchConsoleRowKey(row: Pick<SearchConsoleRow, "country" | "device" | "page" | "query">) {
  return `${row.page}-${row.query}-${row.country}-${row.device}`;
}

export function searchConsoleSuggestionKey(suggestion: Pick<SearchConsoleSuggestion, "page" | "query">) {
  return `${suggestion.page}-${suggestion.query}`;
}

export function formatSearchConsoleCtr(ctr: number) {
  return `${(ctr * 100).toFixed(2)}%`;
}

export function formatSearchConsolePosition(position: number) {
  return position.toFixed(1);
}

export function searchConsoleSuggestionContext(
  suggestion: Pick<SearchConsoleSuggestion, "country" | "device" | "reason">
) {
  return [suggestion.country, suggestion.device, suggestion.reason].filter(Boolean).join(" / ") || "-";
}

export function sectionMatchLabel(diagnostics: SearchConsoleSuggestion["diagnostics"]) {
  const score = diagnostics?.section_match_score;
  return score === undefined ? undefined : `section match ${String(score)}`;
}

export function topInternalLinkCandidates(
  candidates: SearchConsoleInternalLinkCandidate[] | undefined,
  limit = 3
) {
  return candidates?.slice(0, limit) ?? [];
}

export function topMissingSections(sections: SearchConsoleMissingSection[] | undefined, limit = 2) {
  return sections?.slice(0, limit) ?? [];
}

export function topActions(actions: string[] | undefined, limit = 3) {
  return actions?.slice(0, limit) ?? [];
}

export function persistedLinkSummary(candidates: SearchConsoleInternalLinkCandidate[] | undefined, limit = 3) {
  const paths = topInternalLinkCandidates(candidates, limit).map((candidate) => candidate.path);
  return paths.length ? `Links: ${paths.join(", ")}` : undefined;
}
