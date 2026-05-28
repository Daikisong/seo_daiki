import assert from "node:assert/strict";
import { buildBaseLocalizedGuideDrafts } from "../packages/content/src/sample-base-localized-guide-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const drafts = buildBaseLocalizedGuideDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(drafts.length, 2);
assert.deepEqual(
  drafts.map((draft) => `${draft.locale}:${draft.slug}`),
  ["es:cargador-aliexpress-watts-falsos", "pt-br:carregador-aliexpress-watts-falsos"]
);

for (const draft of drafts) {
  assert.equal(draft.type, "guide");
  assert.equal(draft.productId, "prod-baseus-65w");
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.equal(draft.affiliateLinks.length, 0);
}

console.log("Sample base localized guide draft module tests passed");
