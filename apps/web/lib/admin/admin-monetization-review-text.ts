import type { MonetizationReviewRow } from "./admin-monetization-review-types";

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
