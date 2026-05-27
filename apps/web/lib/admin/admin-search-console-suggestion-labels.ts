import type { SearchConsoleSuggestion } from "./search-console-report";

export function searchConsoleSuggestionContext(
  suggestion: Pick<SearchConsoleSuggestion, "country" | "device" | "reason">
) {
  return [suggestion.country, suggestion.device, suggestion.reason].filter(Boolean).join(" / ") || "-";
}

export function sectionMatchLabel(diagnostics: SearchConsoleSuggestion["diagnostics"]) {
  const score = diagnostics?.section_match_score;
  return score === undefined ? undefined : `section match ${String(score)}`;
}
