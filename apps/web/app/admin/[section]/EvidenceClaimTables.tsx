import type { Product } from "@global-import-lab/types";
import {
  productMarketRiskRows,
  productSellerClaimRows,
  productVerifiedClaimRows
} from "@/lib/admin/admin-product-evidence-model";
import type { LabEvidenceRows } from "./EvidenceRecordFormTypes";
import { AdminPanel, RecordActionForm } from "./AdminForms";
import { MarketRiskForm, SellerClaimForm, VerifiedClaimForm } from "./EvidenceRecordForms";

export function ExistingSellerClaimsTable({ products }: { products: Product[] }) {
  return (
    <AdminPanel title="Existing seller claims">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Claim</th>
            <th>Edit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productSellerClaimRows<Product>(products).map(({ claim, label, product }) => (
            <tr key={claim.id}>
              <td>{product.canonicalName}</td>
              <td>{label}</td>
              <td>
                <SellerClaimForm claim={claim} products={products} />
              </td>
              <td>
                <RecordActionForm entityId={claim.id} entityType="seller-claim" returnTo="/admin/evidence/" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPanel>
  );
}

export function ExistingVerifiedClaimsTable({
  labEvidenceAssets,
  products
}: {
  labEvidenceAssets: LabEvidenceRows;
  products: Product[];
}) {
  return (
    <AdminPanel title="Existing verified claims">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Claim</th>
            <th>Edit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productVerifiedClaimRows<Product>(products).map(({ claim, label, product }) => (
            <tr key={claim.id}>
              <td>{product.canonicalName}</td>
              <td>{label}</td>
              <td>
                <VerifiedClaimForm
                  claim={claim}
                  labEvidenceAssets={labEvidenceAssets}
                  listId={`verified-claim-evidence-url-${claim.id}`}
                  products={products}
                />
              </td>
              <td>
                <RecordActionForm entityId={claim.id} entityType="verified-claim" returnTo="/admin/evidence/" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPanel>
  );
}

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
