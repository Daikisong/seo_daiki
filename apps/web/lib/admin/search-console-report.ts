import {
  findProjectRoot,
  readFirstJson,
  searchConsoleRowPaths,
  searchConsoleSuggestionPaths
} from "./search-console-report-files";
import {
  normalizeInternalLink,
  normalizeMissingSection,
  normalizeRow,
  normalizeScoreBreakdown,
  normalizeSuggestion,
  numberValue
} from "./search-console-report-normalizers";
import type { SearchConsoleRow, SearchConsoleSuggestion } from "./search-console-report-types";

export type {
  SearchConsoleInternalLinkCandidate,
  SearchConsoleMissingSection,
  SearchConsoleRow,
  SearchConsoleSuggestion
} from "./search-console-report-types";

export async function readSearchConsoleReport() {
  const root = findProjectRoot();
  const rows = await readFirstJson<SearchConsoleRow[]>(searchConsoleRowPaths(root));
  const suggestions = await readFirstJson<SearchConsoleSuggestion[]>(searchConsoleSuggestionPaths(root));

  return {
    rows: rows.map(normalizeRow),
    suggestions: suggestions.map(normalizeSuggestion)
  };
}

export {
  findProjectRoot,
  normalizeInternalLink,
  normalizeMissingSection,
  normalizeRow,
  normalizeScoreBreakdown,
  normalizeSuggestion,
  numberValue,
  readFirstJson,
  searchConsoleRowPaths,
  searchConsoleSuggestionPaths
};
