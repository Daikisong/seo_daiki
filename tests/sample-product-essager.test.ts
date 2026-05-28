import assert from "node:assert/strict";
import { buildEssagerCableProduct } from "../packages/content/src/sample-product-essager";

const updatedAt = "2026-05-25";
const product = buildEssagerCableProduct({ updatedAt });

assert.equal(product.id, "prod-essager-cable-100w");
assert.equal(product.category, "usb-c-cables");
assert.equal(product.variants.length, 1);
assert.equal(product.variants[0]?.cableIncluded, true);
assert.equal(product.sellerClaims.some((claim) => claim.claimType === "e_marker"), true);
assert.equal(product.verifiedClaims[0]?.testType, "e_marker");
assert.equal(product.priceSnapshots[0]?.finalPrice, 5.9);
assert.deepEqual(
  product.marketRisks.map((risk) => risk.country),
  ["US", "ES", "BR"]
);
assert.equal(product.sellerClaims.every((claim) => claim.capturedAt === updatedAt), true);
assert.equal(product.verifiedClaims.every((claim) => claim.testedAt === updatedAt), true);

console.log("Sample Essager product module tests passed");
