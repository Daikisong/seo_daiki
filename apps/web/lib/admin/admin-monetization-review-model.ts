export const monetizationReviewStatuses = [
  "pending_human_review",
  "approved_candidates",
  "final_approved",
  "rejected"
] as const;

export type MonetizationReviewStatus = (typeof monetizationReviewStatuses)[number];

export interface MonetizationReviewRow {
  id: string;
  articleId?: string;
  market?: string;
  language?: string;
  productAnalysisId?: string;
  status?: string;
  reviewerNotes?: string;
  approvedCandidateIdsJson?: unknown;
  rejectedCandidateIdsJson?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonetizationReviewPayload {
  reviews?: MonetizationReviewRow[];
}

export interface MonetizationReviewUpdate {
  id: string;
  status: MonetizationReviewStatus;
  reviewerNotes?: string;
  approvedCandidateIdsJson?: string[];
  rejectedCandidateIdsJson?: string[];
  updatedAt?: string;
}

export function isMonetizationReviewStatus(value: string): value is MonetizationReviewStatus {
  return monetizationReviewStatuses.includes(value as MonetizationReviewStatus);
}

export function splitCandidateIds(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function candidateIdsText(value: unknown) {
  if (!Array.isArray(value)) {
    return "";
  }
  return value.map((item) => String(item)).join("\n");
}

export function reviewStatusSummary(review: Pick<MonetizationReviewRow, "language" | "market" | "status">) {
  return `${review.status ?? "pending_human_review"} / ${review.market ?? "-"} / ${review.language ?? "-"}`;
}

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
