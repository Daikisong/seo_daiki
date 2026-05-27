import { evidenceRecordReturnTo } from "@/lib/admin/admin-evidence-form-model";
import { adminFieldValue } from "@/lib/admin/admin-form-utils";
import { AdminTokenInput, SaveButton, TextInput } from "./AdminForms";
import type { LabEvidenceRows, ProductRow, ProductRows } from "./EvidenceRecordFormTypes";
import { EvidenceUrlInput, ProductSelect } from "./EvidenceRecordSelects";

export function SellerClaimForm({
  claim,
  products
}: {
  claim?: ProductRow["sellerClaims"][number];
  products: ProductRows;
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="seller-claim" />
      <input name="returnTo" type="hidden" value={evidenceRecordReturnTo.sellerClaim} />
      {claim ? <input name="id" type="hidden" value={claim.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={claim?.productId} products={products} />
      <TextInput defaultValue={claim?.claimType} label="Claim type" name="claimType" required />
      <TextInput defaultValue={claim?.claimValue} label="Claim value" name="claimValue" required />
      <TextInput defaultValue={claim?.confidence} label="Confidence" name="confidence" type="number" />
      <TextInput defaultValue={claim?.sourceUrl} label="Source URL" name="sourceUrl" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Raw text</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={adminFieldValue(claim?.rawText)} name="rawText" />
      </label>
      <SaveButton label={claim ? "Update seller claim" : "Add seller claim"} />
    </form>
  );
}

export function VerifiedClaimForm({
  claim,
  labEvidenceAssets,
  listId,
  products
}: {
  claim?: ProductRow["verifiedClaims"][number];
  labEvidenceAssets: LabEvidenceRows;
  listId: string;
  products: ProductRows;
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="verified-claim" />
      <input name="returnTo" type="hidden" value={evidenceRecordReturnTo.verifiedClaim} />
      {claim ? <input name="id" type="hidden" value={claim.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={claim?.productId} products={products} />
      <TextInput defaultValue={claim?.testType} label="Test type" name="testType" required />
      <TextInput defaultValue={claim?.resultValue} label="Result" name="resultValue" required />
      <TextInput defaultValue={claim?.unit} label="Unit" name="unit" />
      <TextInput defaultValue={claim?.confidence} label="Confidence" name="confidence" type="number" />
      <EvidenceUrlInput defaultValue={claim?.evidenceUrl} labEvidenceAssets={labEvidenceAssets} listId={listId} />
      <TextInput defaultValue={claim?.testedAt} label="Tested at" name="testedAt" type="date" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Method</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={adminFieldValue(claim?.method)} name="method" required />
      </label>
      <SaveButton label={claim ? "Update verified claim" : "Add verified claim"} />
    </form>
  );
}
