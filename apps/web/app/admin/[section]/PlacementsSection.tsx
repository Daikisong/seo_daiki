import { articleRouteLabel, placementDisclosureLabel } from "@/lib/admin/admin-monetization-model";
import { readAffiliatePlacements } from "@/lib/admin/admin-section-data";
import { AdminPanel, PlacementStatusForm } from "./AdminForms";

export async function PlacementsSection() {
  const placements = await readAffiliatePlacements();
  return (
    <AdminPanel title="Affiliate placements">
      {placements.length === 0 ? (
        <p className="text-sm text-neutral-700">No DB-backed placements are available. Connect Postgres and run the seed to approve sample article CTAs.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Placement</th>
              <th>Article</th>
              <th>Offer</th>
              <th>Status</th>
              <th>Disclosure</th>
              <th>Rel</th>
              <th>Clicks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((placement) => (
              <tr key={placement.id}>
                <td>
                  <p className="font-semibold">{placement.anchorText}</p>
                  <p className="text-xs text-neutral-500">{placement.placementType}</p>
                </td>
                <td>
                  <p>{placement.articleTitle}</p>
                  <p className="text-xs text-neutral-500">{articleRouteLabel(placement)}</p>
                </td>
                <td>
                  <p>{placement.offerTitle}</p>
                  <p className="text-xs text-neutral-500">{placement.merchantSlug}</p>
                </td>
                <td>{placement.status}</td>
                <td>{placementDisclosureLabel(placement)}</td>
                <td>{placement.rel}</td>
                <td>{placement.clickCount}</td>
                <td>
                  <PlacementStatusForm placementId={placement.id} returnTo="/admin/placements/" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
