import type { Product } from "@global-import-lab/types";
import { productMarketRiskRows } from "@/lib/admin/admin-product-evidence-model";
import { AdminPanel, RecordActionForm } from "./AdminForms";
import { MarketRiskForm } from "./EvidenceRecordForms";

export function ExistingMarketRisksTable({ products }: { products: Product[] }) {
  return (
    <AdminPanel title="Existing market risks">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Locale</th>
            <th>Risk</th>
            <th>Edit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productMarketRiskRows<Product>(products).map(({ product, risk }) => (
            <tr key={risk.id}>
              <td>{product.canonicalName}</td>
              <td>{risk.locale}</td>
              <td>{risk.score}</td>
              <td>
                <MarketRiskForm products={products} risk={risk} />
              </td>
              <td>
                <RecordActionForm entityId={risk.id} entityType="market-risk" returnTo="/admin/evidence/" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPanel>
  );
}
