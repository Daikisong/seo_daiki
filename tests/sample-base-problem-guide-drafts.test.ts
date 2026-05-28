import assert from "node:assert/strict";
import { buildBaseProblemGuideDrafts } from "../packages/content/src/sample-base-problem-guide-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const guideDrafts = buildBaseProblemGuideDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(guideDrafts.length, 3);
assert.deepEqual(
  guideDrafts.map((draft) => draft.slug),
  [
    "aliexpress-charger-fake-watts",
    "aliexpress-charger-not-charging-laptop",
    "aliexpress-charger-wrong-plug-option"
  ]
);

for (const draft of guideDrafts) {
  assert.equal(draft.type, "guide");
  assert.equal(draft.locale, "en");
  assert.equal(draft.productId, "prod-baseus-65w");
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.equal(draft.affiliateLinks.length, 0);
}

console.log("Sample base problem guide draft module tests passed");
