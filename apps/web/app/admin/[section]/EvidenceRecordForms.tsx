import {
  AdminTokenInput,
  SaveButton,
  TextInput
} from "./AdminForms";
import { adminLocales as locales } from "@/lib/admin/admin-section-config";
import { adminFieldValue } from "@/lib/admin/admin-form-utils";
import {
  evidencePackJsonTextareaValue,
  evidenceRecordReturnTo,
  labEvidenceAssetOptionLabel,
  productOptionRows
} from "@/lib/admin/admin-evidence-form-model";
import { getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { readLabEvidenceAssets } from "@/lib/admin/admin-section-data";

type ProductRows = Awaited<ReturnType<typeof getAllProducts>>;
type ProductRow = ProductRows[number];
type EvidencePackRow = Awaited<ReturnType<typeof getAllEvidencePacks>>[number];
type LabEvidenceRows = Awaited<ReturnType<typeof readLabEvidenceAssets>>;

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

export function MarketRiskForm({
  products,
  risk
}: {
  products: ProductRows;
  risk?: ProductRow["marketRisks"][number];
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="market-risk" />
      <input name="returnTo" type="hidden" value={evidenceRecordReturnTo.marketRisk} />
      {risk ? <input name="id" type="hidden" value={risk.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={risk?.productId} products={products} />
      <label className="text-sm">
        <span className="block text-neutral-600">Locale</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={adminFieldValue(risk?.locale)} name="locale" required>
          <option value="">Select locale</option>
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </label>
      <TextInput defaultValue={risk?.country} label="Country" name="country" />
      <TextInput defaultValue={risk?.plugRisk} label="Plug risk" name="plugRisk" />
      <TextInput defaultValue={risk?.customsRisk} label="Customs risk" name="customsRisk" />
      <TextInput defaultValue={risk?.certificationRisk} label="Certification risk" name="certificationRisk" />
      <TextInput defaultValue={risk?.returnRisk} label="Return risk" name="returnRisk" />
      <TextInput defaultValue={risk?.score} label="Score" name="score" type="number" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Local alternative note</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1"
          defaultValue={adminFieldValue(risk?.localAlternativeNote)}
          name="localAlternativeNote"
        />
      </label>
      <SaveButton label={risk ? "Update market risk" : "Add market risk"} />
    </form>
  );
}

export function EvidencePackForm({
  pack,
  products
}: {
  pack?: EvidencePackRow;
  products: ProductRows;
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="evidence-pack" />
      <input name="returnTo" type="hidden" value={evidenceRecordReturnTo.evidencePack} />
      {pack ? <input name="id" type="hidden" value={pack.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={pack?.productId} products={products} />
      <label className="text-sm">
        <span className="block text-neutral-600">Locale</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={adminFieldValue(pack?.locale)} name="locale" required>
          <option value="">Select locale</option>
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Pack JSON</span>
        <textarea
          className="mt-1 min-h-48 w-full rounded-md border border-neutral-300 px-2 py-1 font-mono text-xs"
          defaultValue={evidencePackJsonTextareaValue(pack?.packJson)}
          name="packJson"
          required
        />
      </label>
      <SaveButton label={pack ? "Update evidence pack" : "Create evidence pack"} />
    </form>
  );
}

function ProductSelect({ defaultValue, products }: { defaultValue?: string; products: ProductRows }) {
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

function EvidenceUrlInput({
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
