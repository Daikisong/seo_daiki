import { readPersistedRefreshSuggestions } from "@/lib/admin/admin-section-data";
import { readSearchConsoleReport } from "@/lib/admin/search-console-report";
import { PersistedRefreshWorkflowTable } from "./PersistedRefreshWorkflowTable";
import { SearchPerformanceRowsTable } from "./SearchPerformanceRowsTable";
import { SearchRefreshSuggestionsTable } from "./SearchRefreshSuggestionsTable";

export async function SearchConsoleSection() {
  const [report, persistedSuggestions] = await Promise.all([
    readSearchConsoleReport(),
    readPersistedRefreshSuggestions()
  ]);

  return (
    <div className="space-y-6">
      <SearchPerformanceRowsTable rows={report.rows} />
      <SearchRefreshSuggestionsTable suggestions={report.suggestions} />
      <PersistedRefreshWorkflowTable suggestions={persistedSuggestions} />
      <p className="text-sm text-neutral-700">
        Import rows with <code>python3 workers/python/cli.py import-search-console</code>, export suggestions with{" "}
        <code>python3 workers/python/cli.py suggest-refreshes</code>, then persist them with the DB admin commands when
        Postgres is available. Once persisted, mark each suggestion as planned, applied, or dismissed from this page.
      </p>
    </div>
  );
}
