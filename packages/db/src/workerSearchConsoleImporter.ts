import { join, resolve } from "node:path";
import { createRefreshSuggestion, importSearchConsoleMetrics } from "./searchConsole";
import {
  refreshSuggestionInput,
  searchConsoleMetricInput
} from "./workerImportRecords";
import {
  defaultExistingPath,
  findProjectRoot,
  readJsonFile
} from "./workerImportPaths";

export async function importSearchConsoleSnapshot(file?: string, root = findProjectRoot()) {
  const path = file ? resolve(file) : defaultExistingPath(root, [
    "data/snapshots/search_console_rows.json",
    "data/snapshots/search_console_sample.json"
  ]);
  const rows = readJsonFile<Array<Record<string, unknown>>>(path);
  await importSearchConsoleMetrics(rows.map(searchConsoleMetricInput));
  return { rows: rows.length, source: path };
}

export async function importRefreshSuggestions(file?: string, root = findProjectRoot()) {
  const path = file ? resolve(file) : join(root, "data/exports/search_console_suggestions.json");
  const rows = readJsonFile<Array<Record<string, unknown>>>(path);
  for (const row of rows) {
    await createRefreshSuggestion(refreshSuggestionInput(row));
  }
  return { rows: rows.length, source: path };
}
