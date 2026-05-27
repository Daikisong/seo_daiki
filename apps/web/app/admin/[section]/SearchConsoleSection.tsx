import {
  formatSearchConsoleCtr,
  formatSearchConsolePosition,
  persistedLinkSummary,
  searchConsoleRowKey,
  searchConsoleSuggestionContext,
  searchConsoleSuggestionKey,
  sectionMatchLabel,
  topActions,
  topInternalLinkCandidates,
  topMissingSections
} from "@/lib/admin/admin-search-console-model";
import { readPersistedRefreshSuggestions } from "@/lib/admin/admin-section-data";
import { readSearchConsoleReport } from "@/lib/admin/search-console-report";
import { AdminPanel, RefreshSuggestionStatusForm } from "./AdminForms";

export async function SearchConsoleSection() {
  const [report, persistedSuggestions] = await Promise.all([
    readSearchConsoleReport(),
    readPersistedRefreshSuggestions()
  ]);

  return (
    <div className="space-y-6">
      <AdminPanel title="Search performance rows">
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Query</th>
              <th>Country</th>
              <th>Device</th>
              <th>Clicks</th>
              <th>Impressions</th>
              <th>CTR</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={searchConsoleRowKey(row)}>
                <td>{row.page}</td>
                <td>{row.query}</td>
                <td>{row.country ?? "-"}</td>
                <td>{row.device ?? "-"}</td>
                <td>{row.clicks}</td>
                <td>{row.impressions}</td>
                <td>{formatSearchConsoleCtr(row.ctr)}</td>
                <td>{formatSearchConsolePosition(row.position)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminPanel>
      <AdminPanel title="Refresh suggestions">
        {report.suggestions.length === 0 ? (
          <p className="text-sm text-neutral-700">No refresh suggestions have been exported yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Page</th>
                <th>Query</th>
                <th>Priority</th>
                <th>Missing section</th>
                <th>Title/meta</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {report.suggestions.map((suggestion) => (
                <tr key={searchConsoleSuggestionKey(suggestion)}>
                  <td>{suggestion.page}</td>
                  <td>
                    <p>{suggestion.query ?? "-"}</p>
                    <p className="mt-1 text-xs text-neutral-500">{searchConsoleSuggestionContext(suggestion)}</p>
                  </td>
                  <td>
                    <p className="font-semibold">{suggestion.priority ?? 0}</p>
                    {sectionMatchLabel(suggestion.diagnostics) ? (
                      <p className="mt-1 text-xs text-neutral-500">
                        {sectionMatchLabel(suggestion.diagnostics)}
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {suggestion.missing_sections?.length ? (
                      <ul className="space-y-2">
                        {suggestion.missing_sections.map((section) => (
                          <li key={section.heading}>
                            <p className="font-semibold">{section.heading}</p>
                            {section.why ? <p className="mt-1 text-sm text-neutral-600">{section.why}</p> : null}
                            {section.recommended_details?.length ? (
                              <p className="mt-1 text-xs text-neutral-500">{section.recommended_details.join(" | ")}</p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <p className="font-semibold">{suggestion.title_candidate ?? "-"}</p>
                    <p className="mt-1 text-sm text-neutral-600">{suggestion.meta_description_candidate ?? "-"}</p>
                  </td>
                  <td>
                    {suggestion.internal_link_candidates?.length ? (
                      <ul className="list-disc pl-5">
                        {topInternalLinkCandidates(suggestion.internal_link_candidates).map((candidate) => (
                          <li key={candidate.path}>
                            <span>{candidate.path}</span>
                            {candidate.anchor ? <span className="block text-xs text-neutral-500">anchor: {candidate.anchor}</span> : null}
                            {candidate.reason ? <span className="block text-xs text-neutral-500">{candidate.reason}</span> : null}
                            {candidate.score ? <span className="block text-xs text-neutral-500">score: {candidate.score}</span> : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <ul className="list-disc pl-5">
                      {suggestion.action.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
      <AdminPanel title="Persisted refresh workflow">
        {persistedSuggestions.length === 0 ? (
          <p className="text-sm text-neutral-700">
            No persisted refresh suggestions are available yet. Import the export into Postgres to track open, planned,
            applied, and dismissed states.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Page</th>
                <th>Query</th>
                <th>Reason/actions</th>
                <th>Updated</th>
                <th>Change status</th>
              </tr>
            </thead>
            <tbody>
              {persistedSuggestions.map((suggestion) => (
                <tr key={suggestion.id}>
                  <td>
                    <p className="font-semibold">{suggestion.status}</p>
                    <p className="text-xs text-neutral-500">{suggestion.id}</p>
                  </td>
                  <td>{suggestion.page}</td>
                  <td>{suggestion.query ?? "-"}</td>
                  <td>
                    <p>{suggestion.reason}</p>
                    {suggestion.priority ? (
                      <p className="mt-1 text-xs font-semibold uppercase text-neutral-500">
                        priority {suggestion.priority}
                      </p>
                    ) : null}
                    {suggestion.titleCandidate ? (
                      <div className="mt-2 text-sm">
                        <p className="font-semibold">{suggestion.titleCandidate}</p>
                        {suggestion.metaDescriptionCandidate ? (
                          <p className="mt-1 text-neutral-600">{suggestion.metaDescriptionCandidate}</p>
                        ) : null}
                      </div>
                    ) : null}
                    {suggestion.missingSections.length ? (
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                        {topMissingSections(suggestion.missingSections).map((section) => (
                          <li key={section.heading}>
                            <span className="font-semibold">{section.heading}</span>
                            {section.intent ? <span className="text-neutral-500"> ({section.intent})</span> : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {persistedLinkSummary(suggestion.internalLinkCandidates) ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        {persistedLinkSummary(suggestion.internalLinkCandidates)}
                      </p>
                    ) : null}
                    {suggestion.actions.length ? (
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                        {topActions(suggestion.actions).map((action) => (
                          <li key={action}>{action}</li>
                        ))}
                      </ul>
                    ) : null}
                  </td>
                  <td>{suggestion.updatedAt}</td>
                  <td>
                    <RefreshSuggestionStatusForm suggestion={suggestion} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
      <p className="text-sm text-neutral-700">
        Import rows with <code>python3 workers/python/cli.py import-search-console</code>, export suggestions with{" "}
        <code>python3 workers/python/cli.py suggest-refreshes</code>, then persist them with the DB admin commands when
        Postgres is available. Once persisted, mark each suggestion as planned, applied, or dismissed from this page.
      </p>
    </div>
  );
}
