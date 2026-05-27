import type { Product } from "@global-import-lab/types";
import { productSellerClaimRows } from "@/lib/admin/admin-product-evidence-model";
import { AdminPanel, RecordActionForm } from "./AdminForms";
import { SellerClaimForm } from "./EvidenceRecordForms";

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
