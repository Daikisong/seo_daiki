import assert from "node:assert/strict";
import {
  candidateIdsText,
  isMonetizationReviewStatus,
  reviewStatusSummary,
  splitCandidateIds,
  updateMonetizationReviewPayload
} from "../apps/web/lib/admin/admin-monetization-review-model";

assert.equal(isMonetizationReviewStatus("approved_candidates"), true);
assert.equal(isMonetizationReviewStatus("auto_approved"), false);
assert.deepEqual(splitCandidateIds("candidate-a, candidate-b\ncandidate-c"), ["candidate-a", "candidate-b", "candidate-c"]);
assert.equal(candidateIdsText(["candidate-a", "candidate-b"]), "candidate-a\ncandidate-b");
assert.equal(candidateIdsText(undefined), "");
assert.equal(reviewStatusSummary({ status: "pending_human_review", market: "us", language: "en" }), "pending_human_review / us / en");

const payload = {
  reviews: [
    {
      id: "review-a",
      articleId: "article-a",
      market: "us",
      language: "en",
      status: "pending_human_review",
      approvedCandidateIdsJson: [],
      rejectedCandidateIdsJson: []
    }
  ]
};

const updated = updateMonetizationReviewPayload(payload, {
  id: "review-a",
  status: "approved_candidates",
  reviewerNotes: "Candidate verified manually.",
  approvedCandidateIdsJson: ["candidate-a"],
  rejectedCandidateIdsJson: ["candidate-b"],
  updatedAt: "2026-05-27T00:00:00.000Z"
});

assert.equal(updated.reviews?.[0]?.status, "approved_candidates");
assert.equal(updated.reviews?.[0]?.reviewerNotes, "Candidate verified manually.");
assert.deepEqual(updated.reviews?.[0]?.approvedCandidateIdsJson, ["candidate-a"]);
assert.deepEqual(updated.reviews?.[0]?.rejectedCandidateIdsJson, ["candidate-b"]);
assert.equal(updated.reviews?.[0]?.updatedAt, "2026-05-27T00:00:00.000Z");
assert.throws(
  () => updateMonetizationReviewPayload(payload, { id: "missing", status: "rejected" }),
  /Monetization review was not found/
);

console.log("Admin monetization review model unit tests passed");
