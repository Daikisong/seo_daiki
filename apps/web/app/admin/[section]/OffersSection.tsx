import { offerLocaleLabel } from "@/lib/admin/admin-monetization-model";
import { readAffiliateMerchants, readAffiliateOffers } from "@/lib/admin/admin-section-data";
import { AdminPanel, OfferForm } from "./AdminForms";

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
                  <td>
                    <OfferForm merchants={merchants} offer={offer} />
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
