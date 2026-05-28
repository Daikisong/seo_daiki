import assert from "node:assert/strict";
import {
  baseComparisonDraftSpecs,
  buildBaseComparisonDraft,
  buildBaseComparisonDrafts
} from "../packages/content/src/sample-base-comparison-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(baseComparisonDraftSpecs.length, 2);
assert.deepEqual(
  baseComparisonDraftSpecs.map((spec) => spec.slug),
  ["65w-vs-100w-gan-charger", "aliexpress-charger-vs-amazon-alternative"]
);
assert.deepEqual(
  baseComparisonDraftSpecs.map((spec) => spec.qualityScore),
  [88, 86]
);

const singleDraft = buildBaseComparisonDraft(context, baseComparisonDraftSpecs[0]);

assert.equal(singleDraft.type, "compare");
assert.equal(singleDraft.productId, "prod-baseus-65w");
assert.equal(singleDraft.indexStatus, "index");
assert.equal(singleDraft.publishStatus, "published");
assert.deepEqual(singleDraft.affiliateLinks, []);
assert.equal(singleDraft.lastUpdated, "2026-05-25");

const drafts = buildBaseComparisonDrafts(context);

assert.deepEqual(
  drafts.map((draft) => draft.group),
  ["compare-65w-100w", "compare-import-local-alternative"]
);
assert.equal(drafts.every((draft) => draft.internalLinks.length > 0), true);
assert.equal(drafts.every((draft) => draft.sections.length > 0), true);

console.log("Sample base comparison draft module split tests passed");
