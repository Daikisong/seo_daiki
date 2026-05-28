import assert from "node:assert/strict";
import {
  buildEssagerCablePriceSnapshots,
  buildEssagerCableSellerClaims,
  buildEssagerCableVerifiedClaims,
  essagerCableMarketRisks,
  essagerCableProductIdentity,
  essagerCableReviewSignals,
  essagerCableVariants
} from "../packages/content/src/sample-product-essager";

assert.deepEqual(essagerCableProductIdentity, {
  id: "prod-essager-cable-100w",
  canonicalName: "Essager-style 100W USB-C Cable",
  slug: "essager-100w-usb-c-cable",
  category: "usb-c-cables",
  brandClaim: "Essager",
  identityConfidence: 0.77,
  imageHash: "pHash:essager100w:c94d31"
});

assert.equal(essagerCableVariants.length, 1);
assert.equal(essagerCableVariants[0]?.id, "var-essager-100w-1m");
assert.equal(essagerCableVariants[0]?.cableIncluded, true);
assert.equal(essagerCableVariants[0]?.riskFlags?.[0], "100W claim depends on e-marker verification");

const firstDate = "2026-05-25";
const secondDate = "2026-06-01";
const sellerClaims = buildEssagerCableSellerClaims(firstDate);
const verifiedClaims = buildEssagerCableVerifiedClaims(firstDate);
const priceSnapshots = buildEssagerCablePriceSnapshots(firstDate);

assert.deepEqual(
  sellerClaims.map((claim) => claim.claimType),
  ["power_rating", "e_marker", "length_option"]
);
assert.equal(sellerClaims.every((claim) => claim.capturedAt === firstDate), true);
assert.equal(verifiedClaims[0]?.testedAt, firstDate);
assert.equal(priceSnapshots[0]?.capturedAt, firstDate);
assert.equal(buildEssagerCableSellerClaims(secondDate)[0]?.capturedAt, secondDate);
assert.equal(buildEssagerCableVerifiedClaims(secondDate)[0]?.testedAt, secondDate);
assert.equal(buildEssagerCablePriceSnapshots(secondDate)[0]?.capturedAt, secondDate);

assert.deepEqual(essagerCableReviewSignals.map((signal) => signal.locale), ["en"]);
assert.deepEqual(
  essagerCableMarketRisks.map((risk) => `${risk.locale}:${risk.country}:${risk.customsRisk}:${risk.score}`),
  ["en:US:low:0.36", "es:ES:medium:0.43", "pt-br:BR:high:0.61"]
);

console.log("Sample Essager product module split tests passed");
