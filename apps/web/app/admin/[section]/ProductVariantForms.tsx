import { evidenceRecordReturnTo } from "@/lib/admin/admin-evidence-form-model";
import { AdminTokenInput, SaveButton, TextInput } from "./AdminForms";
import type { ProductRow } from "./EvidenceRecordFormTypes";

export function ProductForm({ product }: { product?: ProductRow }) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="product" />
      <input name="returnTo" type="hidden" value={evidenceRecordReturnTo.product} />
      {product ? <input name="id" type="hidden" value={product.id} /> : null}
      <AdminTokenInput />
      <TextInput defaultValue={product?.canonicalName} label="Name" name="canonicalName" required />
      <TextInput defaultValue={product?.slug} label="Slug" name="slug" required />
      <TextInput defaultValue={product?.category} label="Category" name="category" required />
      <TextInput defaultValue={product?.brandClaim} label="Brand claim" name="brandClaim" />
      <TextInput defaultValue={product?.identityConfidence} label="Identity confidence" name="identityConfidence" type="number" />
      <TextInput defaultValue={product?.imageHash} label="Image hash" name="imageHash" />
      <SaveButton label={product ? "Update product" : "Create product"} />
    </form>
  );
}

export function VariantForm({
  productId,
  variant
}: {
  productId: string;
  variant?: ProductRow["variants"][number];
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="variant" />
      <input name="returnTo" type="hidden" value={evidenceRecordReturnTo.variant} />
      <input name="productId" type="hidden" value={productId} />
      {variant ? <input name="id" type="hidden" value={variant.id} /> : null}
      <AdminTokenInput />
      <TextInput defaultValue={variant?.optionName} label="Option" name="optionName" required />
      <TextInput defaultValue={variant?.sourceUrl} label="Source URL" name="sourceUrl" required />
      <TextInput defaultValue={variant?.sourceSku} label="Source SKU" name="sourceSku" />
      <TextInput defaultValue={variant?.wattageClaim} label="Wattage" name="wattageClaim" type="number" />
      <TextInput defaultValue={variant?.plugType} label="Plug" name="plugType" />
      <TextInput defaultValue={variant?.cableIncluded === undefined ? "" : String(variant.cableIncluded)} label="Cable included" name="cableIncluded" />
      <TextInput defaultValue={variant?.affiliateUrl} label="Affiliate URL" name="affiliateUrl" />
      <TextInput defaultValue={variant?.sellerName} label="Seller" name="sellerName" />
      <TextInput defaultValue={variant?.sellerId} label="Seller ID" name="sellerId" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Risk flags</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1"
          defaultValue={(variant?.riskFlags ?? []).join("\n")}
          name="riskFlags"
        />
      </label>
      <SaveButton label={variant ? "Update variant" : "Add variant"} />
    </form>
  );
}
