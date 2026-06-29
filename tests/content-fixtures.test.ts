import assert from "node:assert/strict";
import { articles, evidencePacks, indexedArticles, plannedIndexTargetTotal, plannedUrlTotal, products } from "@global-import-lab/content";
import { generatedProductFixtures } from "../packages/content/src/product-fixtures";

assert.equal(products.length, 12);
assert.equal(evidencePacks.length, products.length * 3);
assert.equal(articles.length, 151);
assert.equal(indexedArticles().length, 72);
assert.equal(plannedUrlTotal, 110);
assert.equal(plannedIndexTargetTotal, 34);

const productIds = new Set(products.map((product) => product.id));
assert.equal(productIds.size, products.length);

for (const product of products) {
  assert.ok(product.slug, `${product.id} needs a slug`);
  assert.ok(product.variants.length >= 1, `${product.id} needs at least one variant`);
  assert.ok(product.sellerClaims.length >= 1, `${product.id} needs seller claims`);
  assert.ok(product.verifiedClaims.length >= 1, `${product.id} needs verified claims`);
  assert.ok(product.priceSnapshots.length >= 1, `${product.id} needs a price snapshot`);
  assert.ok(product.marketRisks.some((risk) => risk.locale === "en"), `${product.id} needs an English market risk`);

  for (const variant of product.variants) {
    assert.equal(variant.productId, product.id);
  }
  for (const claim of [...product.sellerClaims, ...product.verifiedClaims]) {
    assert.equal(claim.productId, product.id);
  }
  for (const snapshot of product.priceSnapshots) {
    assert.equal(snapshot.productId, product.id);
  }
  for (const risk of product.marketRisks) {
    assert.equal(risk.productId, product.id);
  }
}

for (const pack of evidencePacks) {
  assert.ok(productIds.has(pack.productId ?? ""), `${pack.id} must point to a sample product`);
  assert.equal(pack.createdAt, "2026-05-25");
  assert.ok(pack.packJson.allowedClaims.length >= 1);
  assert.ok(pack.packJson.forbiddenClaims.length >= 1);
}

const generated = generatedProductFixtures("2030-01-02");
assert.equal(generated.length, 9);
for (const product of generated) {
  assert.equal(product.identityConfidence, 0.74);
  assert.equal(product.variants.length, 2);
  assert.equal(product.sellerClaims.length, 2);
  assert.equal(product.verifiedClaims.length, 1);
  assert.equal(product.reviewSignals.length, 3);
  assert.equal(product.marketRisks.length, 3);
  assert.deepEqual(product.marketRisks.map((risk) => risk.locale), ["en", "es", "pt-br"]);
  assert.equal(product.priceSnapshots[0]?.capturedAt, "2030-01-02");
  assert.equal(product.verifiedClaims[0]?.testedAt, "2030-01-02");
  assert.equal(product.sellerClaims[0]?.capturedAt, "2030-01-02");
  assert.equal(
    product.priceSnapshots[0]?.finalPrice,
    Number(((product.priceSnapshots[0]?.price ?? 0) + (product.priceSnapshots[0]?.shipping ?? 0)).toFixed(2))
  );
}

console.log("Content fixture unit tests passed");
