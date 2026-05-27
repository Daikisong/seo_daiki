import type { EvidencePack, Product } from "@global-import-lab/types";
import {
  nullableAdminText,
  productEvidenceSummary,
  productMarketRiskRows,
  productSellerClaimRows,
  productVariantRows,
  productVerifiedClaimRows
} from "@/lib/admin/admin-product-evidence-model";
import { verifiedClaimOptionRows } from "@/lib/admin/admin-evidence-form-model";
import { readLabEvidenceAssets } from "@/lib/admin/admin-section-data";
import { AdminPanel, RecordActionForm } from "./AdminForms";
import {
  EvidencePackForm,
  MarketRiskForm,
  ProductForm,
  SellerClaimForm,
  VariantForm,
  VerifiedClaimForm
} from "./EvidenceRecordForms";

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

export async function EvidenceSection({
  evidencePacks,
  products
}: {
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  const labEvidenceAssets = await readLabEvidenceAssets();
  const verifiedClaimOptions = verifiedClaimOptionRows(products);

  return (
    <div className="space-y-6">
      <AdminPanel title="Add seller claim">
        <SellerClaimForm products={products} />
      </AdminPanel>
      <AdminPanel title="Add verified claim">
        <VerifiedClaimForm labEvidenceAssets={labEvidenceAssets} listId="new-verified-claim-evidence-url" products={products} />
      </AdminPanel>
      <AdminPanel title="Add market risk">
        <MarketRiskForm products={products} />
      </AdminPanel>
      <AdminPanel title="Create evidence pack">
        <EvidencePackForm products={products} />
      </AdminPanel>
      <form
        action="/api/admin/lab-evidence"
        className="grid gap-3 rounded-md border border-neutral-200 p-4 md:grid-cols-3"
        encType="multipart/form-data"
        method="post"
      >
        <input name="returnTo" type="hidden" value="/admin/evidence/" />
        <label className="text-sm">
          <span className="block text-neutral-600">Admin token</span>
          <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="adminToken" type="password" />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-600">Product</span>
          <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="productId">
            <option value="">Unassigned</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.canonicalName}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-neutral-600">Measurement</span>
          <input
            className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
            name="measurementType"
            placeholder="sustained_output"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="block text-neutral-600">File</span>
          <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="file" type="file" />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-600">Verified claim ID</span>
          <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="verifiedClaimId">
            <option value="">Unassigned</option>
            {verifiedClaimOptions.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {claim.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          <span className="block text-neutral-600">Notes</span>
          <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="notes" />
        </label>
        <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
          Upload evidence
        </button>
      </form>
      <AdminPanel title="Existing lab evidence files">
        {labEvidenceAssets.length === 0 ? (
          <p className="text-sm text-neutral-700">No database-backed lab evidence assets are available yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Measurement</th>
                <th>Product</th>
                <th>Verified claim</th>
                <th>Size</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {labEvidenceAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.fileName}</td>
                  <td>{asset.measurementType}</td>
                  <td>{nullableAdminText(asset.productId)}</td>
                  <td>{nullableAdminText(asset.verifiedClaimId)}</td>
                  <td>{asset.sizeBytes}</td>
                  <td>
                    <a className="text-teal-800 underline" href={asset.publicUrl}>
                      {asset.publicUrl}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
      <table>
        <thead>
          <tr>
            <th>Pack</th>
            <th>Locale</th>
            <th>Allowed claims</th>
            <th>Forbidden claims</th>
            <th>Edit JSON</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evidencePacks.map((pack) => (
            <tr key={pack.id}>
              <td>{pack.id}</td>
              <td>{pack.locale}</td>
              <td>{pack.packJson.allowedClaims.length}</td>
              <td>{pack.packJson.forbiddenClaims.length}</td>
              <td>
                <EvidencePackForm pack={pack} products={products} />
              </td>
              <td>
                <RecordActionForm entityId={pack.id} entityType="evidence-pack" returnTo="/admin/evidence/" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
}
