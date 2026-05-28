import assert from "node:assert/strict";
import { buildBaseMethodologyDrafts } from "../packages/content/src/sample-base-methodology-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const drafts = buildBaseMethodologyDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(drafts.length, 3);
assert.deepEqual(
  drafts.map((draft) => draft.slug),
  ["how-we-test-usb-c-chargers", "how-we-score-aliexpress-products", "price-truth-score"]
);

for (const draft of drafts) {
  assert.equal(draft.type, "methodology");
  assert.equal(draft.locale, "en");
  assert.equal(draft.productId, undefined);
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
}

console.log("Sample base methodology draft module tests passed");
