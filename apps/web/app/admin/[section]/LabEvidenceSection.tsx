import type { Product } from "@global-import-lab/types";
import { nullableAdminText } from "@/lib/admin/admin-product-evidence-model";
import { verifiedClaimOptionRows } from "@/lib/admin/admin-evidence-form-model";
import type { LabEvidenceRows } from "./EvidenceRecordFormTypes";
import { AdminPanel } from "./AdminForms";

export function LabEvidenceSection({
  labEvidenceAssets,
  products
}: {
  labEvidenceAssets: LabEvidenceRows;
  products: Product[];
}) {
  const verifiedClaimOptions = verifiedClaimOptionRows(products);

  return (
    <>
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
    </>
  );
}
