import { articleRouteLabel, candidateApprovalLabel, candidateArticleLabel, placementDisclosureLabel } from "@/lib/admin/admin-monetization-model";
import { readAffiliatePlacementCandidates, readAffiliatePlacements } from "@/lib/admin/admin-section-data";
import { AdminPanel, PlacementStatusForm } from "./AdminForms";

export async function OfferMatchingSection() {
  const [candidates, placements] = await Promise.all([readAffiliatePlacementCandidates(), readAffiliatePlacements()]);
  return (
    <div className="space-y-8">
      <AdminPanel title="Later-phase monetization candidates">
        {candidates.length === 0 ? (
          <p className="text-sm text-neutral-700">
            Offer matching is a later-phase feature flag. Run <code>pnpm pipeline:post-to-product-analysis</code> first,
            then create a monetization review only after human approval.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Article</th>
                <th>Merchant</th>
                <th>Score</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>
                    <p className="font-semibold">{candidate.anchorText}</p>
                    <p className="text-xs text-neutral-500">{candidate.placementType}</p>
                  </td>
                  <td>
                    <p>{candidateArticleLabel(candidate)}</p>
                    <p className="text-xs text-neutral-500">{candidate.topicId}</p>
                  </td>
                  <td>{candidate.merchantSlug}</td>
                  <td>{candidate.offerScore.toFixed(1)}</td>
                  <td>
                    <p>{candidate.status}</p>
                    <p className="text-xs text-neutral-500">{candidateApprovalLabel(candidate)}</p>
                  </td>
                  <td className="max-w-md text-sm text-neutral-700">{candidate.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
      <AdminPanel title="Approve or reject persisted placements">
        {placements.length === 0 ? (
          <p className="text-sm text-neutral-700">No DB-backed placements are available yet. Candidate exports stay draft-only until they are persisted to the database.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Placement</th>
                <th>Offer</th>
                <th>Status</th>
                <th>Disclosure</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((placement) => (
                <tr key={placement.id}>
                  <td>
                    <p className="font-semibold">{placement.anchorText}</p>
                    <p className="text-xs text-neutral-500">{articleRouteLabel(placement)}</p>
                  </td>
                  <td>
                    <p>{placement.offerTitle}</p>
                    <p className="text-xs text-neutral-500">{placement.merchantSlug}</p>
                  </td>
                  <td>{placement.status}</td>
                  <td>{placementDisclosureLabel(placement)}</td>
                  <td>
                    <PlacementStatusForm placementId={placement.id} returnTo="/admin/offer-matching/" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    </div>
  );
}
