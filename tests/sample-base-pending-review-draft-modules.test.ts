import assert from "node:assert/strict";
import {
  basePendingReviewDraftSpecs,
  buildBasePendingReviewDraft,
  buildBasePendingReviewDrafts
} from "../packages/content/src/sample-base-pending-review-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(basePendingReviewDraftSpecs.length, 1);
assert.equal(basePendingReviewDraftSpecs[0].id, "art-en-review-ugreen-pending");
assert.equal(basePendingReviewDraftSpecs[0].internalLinkLimit, 3);
assert.deepEqual(basePendingReviewDraftSpecs[0].evidenceIds, ["vc-ugreen-output", "sc-ugreen-100w-title"]);

const singleDraft = buildBasePendingReviewDraft(context, basePendingReviewDraftSpecs[0]);

assert.equal(singleDraft.type, "review");
assert.equal(singleDraft.productId, "prod-ugreen-100w");
assert.equal(singleDraft.indexStatus, "pending");
assert.equal(singleDraft.publishStatus, "draft");
assert.equal(singleDraft.internalLinks.length, 3);
assert.deepEqual(
  singleDraft.affiliateLinks.map((link) => `${link.href}:${link.rel}`),
  ["https://example.com/go/ugreen-100w:sponsored nofollow"]
);
assert.equal(singleDraft.lastUpdated, "2026-05-25");

const drafts = buildBasePendingReviewDrafts(context);

assert.equal(drafts.length, 1);
assert.equal(drafts[0].id, "art-en-review-ugreen-pending");

console.log("Sample base pending review draft module split tests passed");
