import { adminLocales as locales } from "@/lib/admin/admin-section-config";
import { evidencePackJsonTextareaValue, evidenceRecordReturnTo } from "@/lib/admin/admin-evidence-form-model";
import { adminFieldValue } from "@/lib/admin/admin-form-utils";
import { AdminTokenInput, SaveButton, TextInput } from "./AdminForms";
import type { EvidencePackRow, ProductRow, ProductRows } from "./EvidenceRecordFormTypes";
import { ProductSelect } from "./EvidenceRecordSelects";

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
