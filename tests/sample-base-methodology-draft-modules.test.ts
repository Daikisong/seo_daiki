import assert from "node:assert/strict";
import {
  baseMethodologyDraftSpecs,
  buildBaseMethodologyDraft,
  buildBaseMethodologyDrafts
} from "../packages/content/src/sample-base-methodology-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(baseMethodologyDraftSpecs.length, 3);
assert.deepEqual(
  baseMethodologyDraftSpecs.map((spec) => spec.slug),
  ["how-we-test-usb-c-chargers", "how-we-score-aliexpress-products", "price-truth-score"]
);
assert.deepEqual(
  baseMethodologyDraftSpecs.map((spec) => spec.qualityScore),
  [83, 84, 84]
);
assert.equal(baseMethodologyDraftSpecs.every((spec) => spec.locale === "en"), true);

const singleDraft = buildBaseMethodologyDraft(context, baseMethodologyDraftSpecs[0]);

assert.equal(singleDraft.type, "methodology");
assert.equal(singleDraft.productId, undefined);
assert.equal(singleDraft.indexStatus, "index");
assert.equal(singleDraft.publishStatus, "published");
assert.deepEqual(singleDraft.affiliateLinks, []);
assert.equal(singleDraft.lastUpdated, "2026-05-25");

const drafts = buildBaseMethodologyDrafts(context);

assert.deepEqual(
  drafts.map((draft) => draft.id),
  ["art-en-methodology-test", "art-en-methodology-score", "art-en-methodology-price-truth"]
);
assert.equal(drafts.every((draft) => draft.productId === undefined), true);
assert.equal(drafts.every((draft) => draft.internalLinks.length > 0), true);
assert.equal(drafts.every((draft) => draft.sections.length > 0), true);

console.log("Sample base methodology draft module split tests passed");
