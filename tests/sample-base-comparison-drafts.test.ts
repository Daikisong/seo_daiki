import assert from "node:assert/strict";
import { buildBaseComparisonDrafts } from "../packages/content/src/sample-base-comparison-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const drafts = buildBaseComparisonDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(drafts.length, 2);
assert.deepEqual(
  drafts.map((draft) => draft.slug),
  ["65w-vs-100w-gan-charger", "aliexpress-charger-vs-amazon-alternative"]
);

for (const draft of drafts) {
  assert.equal(draft.type, "compare");
  assert.equal(draft.locale, "en");
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.equal(draft.affiliateLinks.length, 0);
}

console.log("Sample base comparison draft module tests passed");
