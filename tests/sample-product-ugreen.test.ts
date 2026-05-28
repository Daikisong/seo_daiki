import assert from "node:assert/strict";
import { buildUgreenProduct } from "../packages/content/src/sample-product-ugreen";

const updatedAt = "2026-05-25";
const product = buildUgreenProduct({ updatedAt });

assert.equal(product.id, "prod-ugreen-100w");
assert.equal(product.category, "usb-c-chargers");
assert.equal(product.variants.length, 1);
assert.equal(product.variants[0]?.wattageClaim, 100);
assert.equal(product.sellerClaims.length, 2);
assert.equal(product.verifiedClaims[0]?.resultValue, "92");
assert.equal(product.priceSnapshots[0]?.finalPrice, 37.1);
assert.deepEqual(
  product.marketRisks.map((risk) => risk.country),
  ["US", "ES", "BR"]
);
assert.equal(product.sellerClaims.every((claim) => claim.capturedAt === updatedAt), true);
assert.equal(product.verifiedClaims.every((claim) => claim.testedAt === updatedAt), true);

console.log("Sample Ugreen product module tests passed");
