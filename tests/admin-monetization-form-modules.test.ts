import assert from "node:assert/strict";
import {
  MerchantForm,
  OfferForm,
  PlacementStatusForm
} from "../apps/web/app/admin/[section]/AdminMonetizationForms";
import { MerchantForm as DirectMerchantForm } from "../apps/web/app/admin/[section]/MerchantForm";
import { OfferForm as DirectOfferForm } from "../apps/web/app/admin/[section]/OfferForm";
import { PlacementStatusForm as DirectPlacementStatusForm } from "../apps/web/app/admin/[section]/PlacementStatusForm";

assert.equal(MerchantForm, DirectMerchantForm);
assert.equal(OfferForm, DirectOfferForm);
assert.equal(PlacementStatusForm, DirectPlacementStatusForm);

for (const form of [MerchantForm, OfferForm, PlacementStatusForm]) {
  assert.equal(typeof form, "function");
}

console.log("Admin monetization form module tests passed");
