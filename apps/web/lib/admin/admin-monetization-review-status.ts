import {
  monetizationReviewStatuses,
  type MonetizationReviewStatus
} from "./admin-monetization-review-types";

export function isMonetizationReviewStatus(value: string): value is MonetizationReviewStatus {
  return monetizationReviewStatuses.includes(value as MonetizationReviewStatus);
}
