import {
  persistedLinkSummary,
  topActions,
  topMissingSections
} from "@/lib/admin/admin-search-console-model";
import type { readPersistedRefreshSuggestions } from "@/lib/admin/admin-section-data";
import { AdminPanel, RefreshSuggestionStatusForm } from "./AdminForms";

type PersistedRefreshSuggestion = Awaited<ReturnType<typeof readPersistedRefreshSuggestions>>[number];

export function PersistedRefreshWorkflowTable({ suggestions }: { suggestions: PersistedRefreshSuggestion[] }) {
  return (
    <AdminPanel title="Persisted refresh workflow">
      {suggestions.length === 0 ? (
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
            {suggestions.map((suggestion) => (
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
                    <p className="mt-1 text-xs font-semibold uppercase text-neutral-500">priority {suggestion.priority}</p>
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
                    <p className="mt-2 text-xs text-neutral-500">{persistedLinkSummary(suggestion.internalLinkCandidates)}</p>
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
  );
}
