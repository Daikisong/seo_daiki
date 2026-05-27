import type { SearchConsoleRow, SearchConsoleSuggestion } from "./search-console-report";

export function searchConsoleRowKey(row: Pick<SearchConsoleRow, "country" | "device" | "page" | "query">) {
  return `${row.page}-${row.query}-${row.country}-${row.device}`;
}

export function searchConsoleSuggestionKey(suggestion: Pick<SearchConsoleSuggestion, "page" | "query">) {
  return `${suggestion.page}-${suggestion.query}`;
}
