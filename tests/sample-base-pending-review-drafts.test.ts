import assert from "node:assert/strict";
import { buildBasePendingReviewDrafts } from "../packages/content/src/sample-base-pending-review-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const drafts = buildBasePendingReviewDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(drafts.length, 1);

const [draft] = drafts;
assert.equal(draft.id, "art-en-review-ugreen-pending");
assert.equal(draft.productId, "prod-ugreen-100w");
assert.equal(draft.type, "review");
assert.equal(draft.publishStatus, "draft");
assert.equal(draft.indexStatus, "pending");
assert.equal(draft.internalLinks.length, 3);
assert.deepEqual(
  draft.affiliateLinks.map((link) => link.rel),
  ["sponsored nofollow"]
);
assert.equal(draft.lastUpdated, "2026-05-25");

console.log("Sample base pending review draft module tests passed");
