import assert from "node:assert/strict";
import { applyEvidenceRecordMutation } from "../apps/web/lib/admin/evidence-record-route-actions";
import {
  evidenceRecordMutationAction,
  evidenceRecordMutationHandler,
  evidenceRecordMutationHandlers
} from "../apps/web/lib/admin/evidence-record-route-handlers";
import {
  evidencePackMutationPayload,
  marketRiskMutationPayload,
  productMutationPayload,
  sellerClaimMutationPayload,
  verifiedClaimMutationPayload,
  variantMutationPayload
} from "../apps/web/lib/admin/evidence-record-route-payloads";
import {
  sellerClaimMutationPayload as directSellerClaimMutationPayload,
  verifiedClaimMutationPayload as directVerifiedClaimMutationPayload
} from "../apps/web/lib/admin/evidence-record-claim-payloads";
import { evidencePackMutationPayload as directEvidencePackMutationPayload } from "../apps/web/lib/admin/evidence-record-pack-payloads";
import {
  productMutationPayload as directProductMutationPayload,
  variantMutationPayload as directVariantMutationPayload
} from "../apps/web/lib/admin/evidence-record-product-payloads";
import { marketRiskMutationPayload as directMarketRiskMutationPayload } from "../apps/web/lib/admin/evidence-record-risk-payloads";

assert.equal(productMutationPayload, directProductMutationPayload);
assert.equal(variantMutationPayload, directVariantMutationPayload);
assert.equal(sellerClaimMutationPayload, directSellerClaimMutationPayload);
assert.equal(verifiedClaimMutationPayload, directVerifiedClaimMutationPayload);
assert.equal(marketRiskMutationPayload, directMarketRiskMutationPayload);
assert.equal(evidencePackMutationPayload, directEvidencePackMutationPayload);

const productForm = formData({
  canonicalName: " Example Charger ",
  slug: "example-charger",
  category: "consumer-tech",
  identityConfidence: "0.91"
});
assert.equal(evidenceRecordMutationAction(productForm), "create");
assert.deepEqual(productMutationPayload(productForm), {
  id: undefined,
  canonicalName: "Example Charger",
  slug: "example-charger",
  category: "consumer-tech",
  brandClaim: undefined,
  identityConfidence: 0.91,
  imageHash: undefined
});

const variantForm = formData({
  id: "variant-1",
  productId: "product-1",
  optionName: "US plug",
  sourceUrl: "https://merchant.example/item",
  wattageClaim: "65",
  cableIncluded: "yes",
  riskFlags: "plug mismatch, seller changed"
});
assert.equal(evidenceRecordMutationAction(variantForm), "update");
assert.deepEqual(variantMutationPayload(variantForm), {
  id: "variant-1",
  productId: "product-1",
  optionName: "US plug",
  sourceUrl: "https://merchant.example/item",
  sourceSku: undefined,
  wattageClaim: 65,
  plugType: undefined,
  cableIncluded: true,
  affiliateUrl: undefined,
  sellerName: undefined,
  sellerId: undefined,
  riskFlags: ["plug mismatch", "seller changed"]
});

assert.deepEqual(
  evidencePackMutationPayload(formData({ locale: "en", packJson: "{\"source\":\"manual\"}" })),
  {
    id: undefined,
    productId: undefined,
    locale: "en",
    packJson: { source: "manual" }
  }
);

assert.deepEqual(
  sellerClaimMutationPayload(
    formData({
      productId: "product-1",
      claimType: "wattage",
      claimValue: "65W",
      confidence: "0.75"
    })
  ),
  {
    id: undefined,
    productId: "product-1",
    claimType: "wattage",
    claimValue: "65W",
    rawText: undefined,
    sourceUrl: undefined,
    confidence: 0.75
  }
);

assert.deepEqual(
  verifiedClaimMutationPayload(
    formData({
      productId: "product-1",
      testType: "load",
      resultValue: "62",
      method: "bench",
      testedAt: "2026-05-27"
    })
  ),
  {
    id: undefined,
    productId: "product-1",
    testType: "load",
    resultValue: "62",
    unit: undefined,
    method: "bench",
    evidenceUrl: undefined,
    confidence: undefined,
    testedAt: new Date("2026-05-27")
  }
);

assert.deepEqual(
  marketRiskMutationPayload(
    formData({
      productId: "product-1",
      locale: "pt-br",
      country: "BR",
      customsRisk: "import tax",
      score: "72"
    })
  ),
  {
    id: undefined,
    productId: "product-1",
    locale: "pt-br",
    country: "BR",
    plugRisk: undefined,
    customsRisk: "import tax",
    certificationRisk: undefined,
    returnRisk: undefined,
    localAlternativeNote: undefined,
    score: 72
  }
);

main();

function formData(values: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) {
    form.set(key, value);
  }
  return form;
}

function recordMutation(calls: Array<{ name: string; payload: unknown }>, name: string, id: string, payload: unknown) {
  calls.push({ name, payload });
  return { id };
}

async function main() {
  const calls: Array<{ name: string; payload: unknown }> = [];
  const mutations = {
    upsertProduct: async (payload: unknown) => recordMutation(calls, "product", "product-1", payload),
    upsertVariant: async (payload: unknown) => recordMutation(calls, "variant", "variant-1", payload),
    upsertSellerClaim: async (payload: unknown) => recordMutation(calls, "seller-claim", "seller-claim-1", payload),
    upsertVerifiedClaim: async (payload: unknown) => recordMutation(calls, "verified-claim", "verified-claim-1", payload),
    upsertMarketRisk: async (payload: unknown) => recordMutation(calls, "market-risk", "market-risk-1", payload),
    upsertEvidencePack: async (payload: unknown) => recordMutation(calls, "evidence-pack", "evidence-pack-1", payload)
  };

  const result = await applyEvidenceRecordMutation("product", productForm, mutations as never);
  assert.deepEqual(result, { action: "create", updatedId: "product-1" });
  assert.deepEqual(calls[0], { name: "product", payload: productMutationPayload(productForm) });

  assert.equal(evidenceRecordMutationHandler("variant"), evidenceRecordMutationHandlers.variant);
  assert.throws(() => evidenceRecordMutationHandler("bad-type"), /Unsupported recordType/);

  console.log("Evidence record route action module tests passed");
}
