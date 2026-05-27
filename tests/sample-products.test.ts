import assert from "node:assert/strict";
import { buildSampleProducts } from "../packages/content/src/sample-products";

const updatedAt = "2026-05-25";
const products = buildSampleProducts(updatedAt);

assert.equal(products.length, 10);
assert.equal(new Set(products.map((product) => product.id)).size, products.length);
assert.deepEqual(
  products.slice(0, 3).map((product) => product.id),
  ["prod-baseus-65w", "prod-ugreen-100w", "prod-essager-cable-100w"]
);

const baseus = products.find((product) => product.id === "prod-baseus-65w");
assert.equal(baseus?.variants.length, 3);
assert.equal(baseus?.sellerClaims[0]?.capturedAt, updatedAt);
assert.equal(baseus?.verifiedClaims[0]?.testedAt, updatedAt);
assert.equal(baseus?.priceSnapshots[0]?.capturedAt, updatedAt);
assert.equal(baseus?.marketRisks.some((risk) => risk.country === "BR" && risk.locale === "pt-br"), true);

const generatedPowerBank = products.find((product) => product.id === "prod-zmi-20000-power-bank");
assert.equal(generatedPowerBank?.identityConfidence, 0.74);
assert.equal(generatedPowerBank?.variants.length, 2);
assert.equal(generatedPowerBank?.sellerClaims.every((claim) => claim.capturedAt === updatedAt), true);
assert.equal(generatedPowerBank?.verifiedClaims.every((claim) => claim.testedAt === updatedAt), true);
assert.equal(generatedPowerBank?.priceSnapshots.every((snapshot) => snapshot.capturedAt === updatedAt), true);

for (const product of products) {
  assert.ok(product.variants.length >= 1, `${product.id} needs at least one variant`);
  assert.ok(product.sellerClaims.length >= 1, `${product.id} needs seller claims`);
  assert.ok(product.verifiedClaims.length >= 1, `${product.id} needs verified claims`);
  assert.ok(product.priceSnapshots.length >= 1, `${product.id} needs price snapshots`);
  assert.ok(product.marketRisks.length >= 1, `${product.id} needs market risks`);
}

console.log("Sample product unit tests passed");
