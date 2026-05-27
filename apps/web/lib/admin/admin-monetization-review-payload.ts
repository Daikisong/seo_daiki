import type {
  MonetizationReviewPayload,
  MonetizationReviewUpdate
} from "./admin-monetization-review-types";

export function updateMonetizationReviewPayload(
  payload: MonetizationReviewPayload,
  update: MonetizationReviewUpdate
): MonetizationReviewPayload {
  const reviews = payload.reviews ?? [];
  let found = false;
  const updatedReviews = reviews.map((review) => {
    if (review.id !== update.id) {
      return review;
    }
    found = true;
    return {
      ...review,
      status: update.status,
      reviewerNotes: update.reviewerNotes ?? review.reviewerNotes,
      approvedCandidateIdsJson: update.approvedCandidateIdsJson ?? review.approvedCandidateIdsJson ?? [],
      rejectedCandidateIdsJson: update.rejectedCandidateIdsJson ?? review.rejectedCandidateIdsJson ?? [],
      updatedAt: update.updatedAt ?? new Date().toISOString()
    };
  });

  if (!found) {
    throw new Error(`Monetization review was not found: ${update.id}`);
  }

  return { ...payload, reviews: updatedReviews };
}
