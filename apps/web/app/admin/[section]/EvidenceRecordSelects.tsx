import { adminFieldValue } from "@/lib/admin/admin-form-utils";
import { labEvidenceAssetOptionLabel, productOptionRows } from "@/lib/admin/admin-evidence-form-model";
import type { LabEvidenceRows, ProductRows } from "./EvidenceRecordFormTypes";

export function ProductSelect({ defaultValue, products }: { defaultValue?: string; products: ProductRows }) {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Product</span>
      <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={adminFieldValue(defaultValue)} name="productId" required>
        <option value="">Select product</option>
        {productOptionRows(products).map((product) => (
          <option key={product.value} value={product.value}>
            {product.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EvidenceUrlInput({
  defaultValue,
  labEvidenceAssets,
  listId
}: {
  defaultValue?: string;
  labEvidenceAssets: LabEvidenceRows;
  listId: string;
}) {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Evidence URL</span>
      <input
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
        defaultValue={adminFieldValue(defaultValue)}
        list={listId}
        name="evidenceUrl"
      />
      <datalist id={listId}>
        {labEvidenceAssets.map((asset) => (
          <option key={asset.id} value={asset.publicUrl}>
            {labEvidenceAssetOptionLabel(asset)}
          </option>
        ))}
      </datalist>
    </label>
  );
}
