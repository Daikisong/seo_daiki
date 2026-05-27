import { allowedDomainsLabel, merchantEnabledLabel, merchantHealthLabel } from "@/lib/admin/admin-monetization-model";
import { readAffiliateMerchants } from "@/lib/admin/admin-section-data";
import { AdminPanel, MerchantForm } from "./AdminForms";

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
                  <td>
                    <MerchantForm merchant={merchant} />
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
