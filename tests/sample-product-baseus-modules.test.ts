import assert from "node:assert/strict";
import {
  baseusMarketRisks,
  baseusProductIdentity,
  baseusReviewSignals,
  baseusVariants,
  buildBaseusPriceSnapshots,
  buildBaseusSellerClaims,
  buildBaseusVerifiedClaims
} from "../packages/content/src/sample-product-baseus";

assert.deepEqual(baseusProductIdentity, {
  id: "prod-baseus-65w",
  canonicalName: "Baseus-style 65W GaN Charger",
  slug: "baseus-65w-gan-charger",
  category: "usb-c-chargers",
  brandClaim: "Baseus",
  identityConfidence: 0.86,
  imageHash: "pHash:baseus65w:8fe421"
});

assert.deepEqual(
  baseusVariants.map((variant) => variant.id),
  ["var-baseus-65w-us", "var-baseus-65w-eu-cable", "var-baseus-45w-trap"]
);
assert.equal(baseusVariants[2]?.riskFlags?.includes("Title says 65W, but this option is a 45W SKU"), true);

const firstDate = "2026-05-25";
const secondDate = "2026-06-01";
const sellerClaims = buildBaseusSellerClaims(firstDate);
const verifiedClaims = buildBaseusVerifiedClaims(firstDate);
const priceSnapshots = buildBaseusPriceSnapshots(firstDate);

assert.equal(sellerClaims.length, 3);
assert.equal(verifiedClaims.length, 3);
assert.equal(priceSnapshots.length, 4);
assert.equal(sellerClaims.every((claim) => claim.capturedAt === firstDate), true);
assert.equal(verifiedClaims.every((claim) => claim.testedAt === firstDate), true);
assert.equal(priceSnapshots.every((snapshot) => snapshot.capturedAt === firstDate), true);
assert.equal(buildBaseusSellerClaims(secondDate)[0]?.capturedAt, secondDate);
assert.equal(buildBaseusVerifiedClaims(secondDate)[0]?.testedAt, secondDate);
assert.equal(buildBaseusPriceSnapshots(secondDate)[0]?.capturedAt, secondDate);

assert.deepEqual(
  baseusReviewSignals.map((signal) => signal.locale),
  ["en", "en", "es", "pt-br"]
);
assert.deepEqual(
  baseusMarketRisks.map((risk) => risk.country),
  ["US", "GB", "ES", "BR"]
);
assert.equal(baseusMarketRisks.some((risk) => risk.country === "BR" && risk.customsRisk === "high"), true);

console.log("Sample Baseus product module split tests passed");
