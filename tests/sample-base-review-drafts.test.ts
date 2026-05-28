import assert from "node:assert/strict";
import { buildBaseReviewDrafts } from "../packages/content/src/sample-base-review-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const reviewDrafts = buildBaseReviewDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(reviewDrafts.length, 3);
assert.deepEqual(
  reviewDrafts.map((draft) => `${draft.locale}:${draft.slug}`),
  [
    "en:baseus-65w-gan-charger-real-output",
    "es:cargador-gan-65w-baseus-potencia-real",
    "pt-br:carregador-gan-65w-baseus-potencia-real"
  ]
);

for (const draft of reviewDrafts) {
  assert.equal(draft.type, "review");
  assert.equal(draft.group, "review-baseus-65w");
  assert.equal(draft.productId, "prod-baseus-65w");
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.ok(draft.affiliateLinks.every((link) => link.rel === "sponsored nofollow"));
}

console.log("Sample base review draft module tests passed");
