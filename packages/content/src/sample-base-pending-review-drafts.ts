import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBasePendingReviewDraft } from "./sample-base-pending-review-draft-builder";
import { basePendingReviewDraftSpecs } from "./sample-base-pending-review-draft-specs";

export { buildBasePendingReviewDraft } from "./sample-base-pending-review-draft-builder";
export { basePendingReviewDraftSpecs } from "./sample-base-pending-review-draft-specs";
export type { BasePendingReviewDraftSpec } from "./sample-base-pending-review-draft-types";

export function buildBasePendingReviewDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return basePendingReviewDraftSpecs.map((spec) => buildBasePendingReviewDraft(context, spec));
}
