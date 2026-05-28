import assert from "node:assert/strict";
import {
  buildUgreenPriceSnapshots,
  buildUgreenSellerClaims,
  buildUgreenVerifiedClaims,
  ugreenMarketRisks,
  ugreenProductIdentity,
  ugreenReviewSignals,
  ugreenVariants
} from "../packages/content/src/sample-product-ugreen";

assert.deepEqual(ugreenProductIdentity, {
  id: "prod-ugreen-100w",
  canonicalName: "Ugreen-style 100W GaN Charger",
  slug: "ugreen-100w-gan-charger",
  category: "usb-c-chargers",
  brandClaim: "Ugreen",
  identityConfidence: 0.81,
  imageHash: "pHash:ugreen100w:4ab192"
});

assert.equal(ugreenVariants.length, 1);
assert.equal(ugreenVariants[0]?.id, "var-ugreen-100w-us");
assert.equal(ugreenVariants[0]?.wattageClaim, 100);
assert.equal(ugreenVariants[0]?.plugType, "US");
assert.equal(ugreenVariants[0]?.riskFlags?.[0], "Higher sustained output needs better cable selection");

const firstDate = "2026-05-25";
const secondDate = "2026-06-01";
const sellerClaims = buildUgreenSellerClaims(firstDate);
const verifiedClaims = buildUgreenVerifiedClaims(firstDate);
const priceSnapshots = buildUgreenPriceSnapshots(firstDate);

assert.deepEqual(
  sellerClaims.map((claim) => claim.claimType),
  ["max_output", "ports"]
);
assert.equal(sellerClaims.every((claim) => claim.capturedAt === firstDate), true);
assert.equal(verifiedClaims[0]?.resultValue, "92");
assert.equal(verifiedClaims[0]?.testedAt, firstDate);
assert.equal(priceSnapshots[0]?.finalPrice, 37.1);
assert.equal(priceSnapshots[0]?.capturedAt, firstDate);
assert.equal(buildUgreenSellerClaims(secondDate)[0]?.capturedAt, secondDate);
assert.equal(buildUgreenVerifiedClaims(secondDate)[0]?.testedAt, secondDate);
assert.equal(buildUgreenPriceSnapshots(secondDate)[0]?.capturedAt, secondDate);

assert.deepEqual(ugreenReviewSignals.map((signal) => `${signal.locale}:${signal.sentiment}`), ["en:neutral"]);
assert.deepEqual(
  ugreenMarketRisks.map((risk) => `${risk.locale}:${risk.country}:${risk.customsRisk}:${risk.score}`),
  ["en:US:low:0.47", "es:ES:medium:0.53", "pt-br:BR:high:0.72"]
);

console.log("Sample Ugreen product module split tests passed");
