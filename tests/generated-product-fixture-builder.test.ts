import assert from "node:assert/strict";
import { generatedSampleProduct } from "../packages/content/src/generated-product-fixture-builder";
import type { GeneratedProductSpec } from "../packages/content/src/generated-product-fixture-types";

const updatedAt = "2026-05-25";
const product = generatedSampleProduct(sampleSpec(), updatedAt);

assert.equal(product.id, "prod-test-65w");
assert.equal(product.identityConfidence, 0.74);
assert.deepEqual(
  product.variants.map((variant) => variant.id),
  ["var-test-65w-primary", "var-test-65w-trap"]
);
assert.equal(product.variants[0]?.cableIncluded, false);
assert.equal(product.priceSnapshots[0]?.finalPrice, 12.75);
assert.deepEqual(
  product.marketRisks.map((risk) => `${risk.locale}:${risk.country}:${risk.customsRisk}`),
  ["en:US:low", "es:ES:medium", "pt-br:BR:high"]
);
assert.equal(product.sellerClaims.every((claim) => claim.capturedAt === updatedAt), true);
assert.equal(product.verifiedClaims.every((claim) => claim.testedAt === updatedAt), true);

console.log("Generated product fixture builder tests passed");

function sampleSpec(): GeneratedProductSpec {
  return {
    id: "prod-test-65w",
    canonicalName: "Test 65W Charger",
    slug: "test-65w-charger",
    category: "usb-c-chargers",
    brandClaim: "Test",
    claimType: "max_output",
    claimValue: "65W",
    verifiedTestType: "sustained_output",
    verifiedResult: "61",
    verifiedUnit: "W",
    optionName: "65W US plug, no cable",
    trapOptionName: "33W cheapest option",
    wattageClaim: 65,
    trapWattageClaim: 33,
    plugType: "US",
    sourceSlug: "test-65w",
    price: 10.5,
    shipping: 2.25,
    sellerName: "Test Store",
    riskTopic: "test risk topic"
  };
}
