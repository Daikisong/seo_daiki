import type { Product } from "@global-import-lab/types";
import { productVerifiedClaimRows } from "@/lib/admin/admin-product-evidence-model";
import type { LabEvidenceRows } from "./EvidenceRecordFormTypes";
import { AdminPanel, RecordActionForm } from "./AdminForms";
import { VerifiedClaimForm } from "./EvidenceRecordForms";

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
