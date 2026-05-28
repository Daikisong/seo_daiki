import assert from "node:assert/strict";
import {
  buildGeneratedMarketRisks,
  buildGeneratedPriceSnapshots,
  buildGeneratedProductVariants,
  buildGeneratedReviewSignals,
  buildGeneratedSellerClaims,
  buildGeneratedVerifiedClaims,
  generatedProductBuildContext,
  generatedProductLocaleRisk,
  generatedProductMarketLocales
} from "../packages/content/src/generated-product-fixture-builder";
import type { GeneratedProductSpec } from "../packages/content/src/generated-product-fixture-types";

const updatedAt = "2026-05-25";
const chargerSpec = sampleSpec();
const chargerContext = generatedProductBuildContext(chargerSpec);

assert.deepEqual(chargerContext, {
  sourceUrl: "https://example.com/source/test-65w",
  affiliateUrl: "https://example.com/go/test-65w",
  primaryVariantId: "var-test-65w-primary",
  trapVariantId: "var-test-65w-trap",
  sellerId: "seller-test-65w",
  isCable: false
});

const chargerVariants = buildGeneratedProductVariants(chargerSpec, chargerContext);
assert.equal(chargerVariants.length, 2);
assert.equal(chargerVariants[0]?.sourceSku, "TEST-65W-MAIN");
assert.equal(chargerVariants[0]?.cableIncluded, false);
assert.equal(chargerVariants[1]?.sourceSku, "TEST-65W-TRAP");
assert.equal(chargerVariants[1]?.riskFlags?.[0]?.includes("33W cheapest option"), true);

const cableVariants = buildGeneratedProductVariants({ ...chargerSpec, category: "usb-c-cables", optionName: "240W cable" });
assert.equal(cableVariants[0]?.cableIncluded, true);

const sellerClaims = buildGeneratedSellerClaims(chargerSpec, updatedAt, chargerContext);
assert.deepEqual(
  sellerClaims.map((claim) => `${claim.id}:${claim.claimType}:${claim.capturedAt}`),
  ["sc-test-65w-primary:max_output:2026-05-25", "sc-test-65w-bundle:variant_scope:2026-05-25"]
);
assert.equal(sellerClaims[1]?.rawText, "Options include 65W US plug, no cable and 33W cheapest option");

const verifiedClaims = buildGeneratedVerifiedClaims(chargerSpec, updatedAt);
assert.equal(verifiedClaims[0]?.id, "vc-test-65w-primary");
assert.equal(verifiedClaims[0]?.unit, "W");
assert.equal(verifiedClaims[0]?.testedAt, updatedAt);

const reviewSignals = buildGeneratedReviewSignals(chargerSpec);
assert.deepEqual(
  reviewSignals.map((signal) => `${signal.locale}:${signal.topic}`),
  [
    "en:test risk topic",
    "es:confusion about selected variant",
    "pt-br:tax and return risk after import"
  ]
);

const priceSnapshots = buildGeneratedPriceSnapshots(chargerSpec, updatedAt, chargerContext);
assert.equal(priceSnapshots[0]?.variantId, "var-test-65w-primary");
assert.equal(priceSnapshots[0]?.finalPrice, 12.75);
assert.equal(priceSnapshots[0]?.capturedAt, updatedAt);

assert.deepEqual(generatedProductMarketLocales, ["en", "es", "pt-br"]);
assert.deepEqual(
  buildGeneratedMarketRisks(chargerSpec).map((risk) => `${risk.locale}:${risk.country}:${risk.customsRisk}:${risk.returnRisk}:${risk.score}`),
  ["en:US:low:medium:0.44", "es:ES:medium:medium:0.52", "pt-br:BR:high:high:0.7"]
);
assert.equal(generatedProductLocaleRisk({ ...chargerSpec, plugType: undefined }, "en").plugRisk, "none");

console.log("Generated product fixture module tests passed");

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
