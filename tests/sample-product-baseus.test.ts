import assert from "node:assert/strict";
import { buildBaseusProduct } from "../packages/content/src/sample-product-baseus";

const updatedAt = "2026-05-25";
const product = buildBaseusProduct({ updatedAt });

assert.equal(product.id, "prod-baseus-65w");
assert.equal(product.variants.length, 3);
assert.deepEqual(
  product.variants.map((variant) => variant.id),
  ["var-baseus-65w-us", "var-baseus-65w-eu-cable", "var-baseus-45w-trap"]
);
assert.equal(product.variants.some((variant) => variant.wattageClaim === 45), true);
assert.equal(product.sellerClaims.every((claim) => claim.capturedAt === updatedAt), true);
assert.equal(product.verifiedClaims.every((claim) => claim.testedAt === updatedAt), true);
assert.equal(product.priceSnapshots.every((snapshot) => snapshot.capturedAt === updatedAt), true);
assert.equal(product.marketRisks.some((risk) => risk.country === "BR" && risk.returnRisk === "high"), true);

console.log("Sample Baseus product module tests passed");
