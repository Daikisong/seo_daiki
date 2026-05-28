import assert from "node:assert/strict";
import { baseReviewDraftSpecs, buildBaseReviewDrafts } from "../packages/content/src/sample-base-review-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

assert.equal(baseReviewDraftSpecs.length, 3);
assert.deepEqual(baseReviewDraftSpecs.map((spec) => spec.locale), ["en", "es", "pt-br"]);
assert.deepEqual(baseReviewDraftSpecs.map((spec) => spec.qualityScore), [94, 90, 89]);
assert.equal(baseReviewDraftSpecs.every((spec) => spec.group === "review-baseus-65w"), true);
assert.equal(baseReviewDraftSpecs.every((spec) => spec.productId === "prod-baseus-65w"), true);
assert.deepEqual(
  baseReviewDraftSpecs.map((spec) => `${spec.locale}:${spec.affiliateHref}`),
  [
    "en:https://example.com/go/baseus-65w-us",
    "es:https://example.com/go/baseus-65w-eu",
    "pt-br:https://example.com/go/baseus-65w-us"
  ]
);

const drafts = buildBaseReviewDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.deepEqual(
  drafts.map((draft) => draft.id),
  ["art-en-review-baseus", "art-es-review-baseus", "art-pt-review-baseus"]
);
assert.equal(drafts.every((draft) => draft.affiliateLinks[0]?.rel === "sponsored nofollow"), true);

console.log("Sample base review draft module tests passed");
