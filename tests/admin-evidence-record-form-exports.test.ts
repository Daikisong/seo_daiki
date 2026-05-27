import assert from "node:assert/strict";
import {
  EvidencePackForm,
  MarketRiskForm,
  ProductForm,
  SellerClaimForm,
  VariantForm,
  VerifiedClaimForm
} from "../apps/web/app/admin/[section]/EvidenceRecordForms";
import { SellerClaimForm as DirectSellerClaimForm, VerifiedClaimForm as DirectVerifiedClaimForm } from "../apps/web/app/admin/[section]/EvidenceClaimForms";
import { EvidencePackForm as DirectEvidencePackForm, MarketRiskForm as DirectMarketRiskForm } from "../apps/web/app/admin/[section]/EvidenceRiskPackForms";
import { ProductForm as DirectProductForm, VariantForm as DirectVariantForm } from "../apps/web/app/admin/[section]/ProductVariantForms";

assert.equal(ProductForm, DirectProductForm);
assert.equal(VariantForm, DirectVariantForm);
assert.equal(SellerClaimForm, DirectSellerClaimForm);
assert.equal(VerifiedClaimForm, DirectVerifiedClaimForm);
assert.equal(MarketRiskForm, DirectMarketRiskForm);
assert.equal(EvidencePackForm, DirectEvidencePackForm);

for (const form of [ProductForm, VariantForm, SellerClaimForm, VerifiedClaimForm, MarketRiskForm, EvidencePackForm]) {
  assert.equal(typeof form, "function");
}

console.log("Admin evidence record form module export tests passed");
