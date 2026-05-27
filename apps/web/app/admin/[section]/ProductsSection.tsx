import type { Product } from "@global-import-lab/types";
import { productEvidenceSummary, productVariantRows } from "@/lib/admin/admin-product-evidence-model";
import { AdminPanel, RecordActionForm } from "./AdminForms";
import { ProductForm, VariantForm } from "./EvidenceRecordForms";

export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <div className="space-y-8">
      <AdminPanel title="Create product">
        <ProductForm />
      </AdminPanel>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Evidence</th>
            <th>Edit product</th>
            <th>Add variant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <p className="font-semibold">{product.canonicalName}</p>
                <p className="text-sm text-neutral-600">{product.category}</p>
              </td>
              <td>
                {productEvidenceSummary(product).map((summary) => (
                  <p key={summary}>{summary}</p>
                ))}
              </td>
              <td>
                <ProductForm product={product} />
              </td>
              <td>
                <VariantForm productId={product.id} />
              </td>
              <td>
                <RecordActionForm entityId={product.id} entityType="product" returnTo="/admin/products/" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminPanel title="Existing variants">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Edit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productVariantRows<Product>(products).map(({ product, variant }) => (
              <tr key={variant.id}>
                <td>{product.canonicalName}</td>
                <td>{variant.optionName}</td>
                <td>
                  <VariantForm productId={product.id} variant={variant} />
                </td>
                <td>
                  <RecordActionForm entityId={variant.id} entityType="variant" returnTo="/admin/products/" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminPanel>
    </div>
  );
}
