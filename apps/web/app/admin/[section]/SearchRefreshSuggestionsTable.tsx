import {
  searchConsoleSuggestionContext,
  searchConsoleSuggestionKey,
  sectionMatchLabel,
  topInternalLinkCandidates
} from "@/lib/admin/admin-search-console-model";
import type { SearchConsoleSuggestion } from "@/lib/admin/search-console-report";
import { AdminPanel } from "./AdminForms";

export function SearchRefreshSuggestionsTable({ suggestions }: { suggestions: SearchConsoleSuggestion[] }) {
  return (
    <AdminPanel title="Refresh suggestions">
      {suggestions.length === 0 ? (
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
            {suggestions.map((suggestion) => (
              <tr key={searchConsoleSuggestionKey(suggestion)}>
                <td>{suggestion.page}</td>
                <td>
                  <p>{suggestion.query ?? "-"}</p>
                  <p className="mt-1 text-xs text-neutral-500">{searchConsoleSuggestionContext(suggestion)}</p>
                </td>
                <td>
                  <p className="font-semibold">{suggestion.priority ?? 0}</p>
                  {sectionMatchLabel(suggestion.diagnostics) ? (
                    <p className="mt-1 text-xs text-neutral-500">{sectionMatchLabel(suggestion.diagnostics)}</p>
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
  );
}
