import {
  allowedDomainsLabel,
  articleRouteLabel,
  candidateApprovalLabel,
  candidateArticleLabel,
  merchantEnabledLabel,
  merchantHealthLabel,
  offerLocaleLabel,
  placementDisclosureLabel
} from "@/lib/admin/admin-monetization-model";
import {
  readAffiliateMerchants,
  readAffiliateOffers,
  readAffiliatePlacementCandidates,
  readAffiliatePlacements
} from "@/lib/admin/admin-section-data";
import { AdminPanel, MerchantForm, OfferForm, PlacementStatusForm } from "./AdminForms";

export async function MerchantsSection() {
  const merchants = await readAffiliateMerchants();
  return (
    <div className="space-y-8">
      <AdminPanel title="Create or edit merchant">
        <MerchantForm />
      </AdminPanel>
      <AdminPanel title="Affiliate merchants">
        {merchants.length === 0 ? (
          <p className="text-sm text-neutral-700">No DB-backed merchants are available. Connect Postgres and run the seed to populate AliExpress and iHerb.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Type</th>
                <th>Allowed domains</th>
                <th>Health</th>
                <th>Status</th>
                <th>Rows</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td>
                    <p className="font-semibold">{merchant.name}</p>
                    <p className="text-xs text-neutral-500">{merchant.slug}</p>
                  </td>
                  <td>{merchant.merchantType}</td>
                  <td>{allowedDomainsLabel(merchant.allowedDomains)}</td>
                  <td>{merchantHealthLabel(merchant)}</td>
                  <td>{merchantEnabledLabel(merchant)}</td>
                  <td>
                    <p>{merchant.offerCount} offers</p>
                    <p>{merchant.clickCount} clicks</p>
                  </td>
                  <td><MerchantForm merchant={merchant} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    </div>
  );
}

export async function OffersSection() {
  const [offers, merchants] = await Promise.all([readAffiliateOffers(), readAffiliateMerchants()]);
  return (
    <div className="space-y-8">
      <AdminPanel title="Create or edit offer">
        <OfferForm merchants={merchants} />
      </AdminPanel>
      <AdminPanel title="Affiliate offers">
        {offers.length === 0 ? (
          <p className="text-sm text-neutral-700">No DB-backed offers are available. Connect Postgres and run the seed to create sample offer rows.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Offer</th>
                <th>Merchant</th>
                <th>Locale</th>
                <th>Category</th>
                <th>Status</th>
                <th>Placements</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td>
                    <p className="font-semibold">{offer.title}</p>
                    <p className="max-w-md truncate text-xs text-neutral-500">{offer.affiliateUrl}</p>
                  </td>
                  <td>{offer.merchantSlug}</td>
                  <td>{offerLocaleLabel(offer.locale)}</td>
                  <td>{offer.category}</td>
                  <td>{offer.status}</td>
                  <td>
                    <p>{offer.placementCount} placements</p>
                    <p>{offer.clickCount} clicks</p>
                  </td>
                  <td><OfferForm merchants={merchants} offer={offer} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    </div>
  );
}

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
