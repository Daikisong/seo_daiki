import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseReviewDraft } from "./sample-base-review-draft-builder";
import { baseReviewDraftSpecs } from "./sample-base-review-draft-specs";

export { buildBaseReviewDraft } from "./sample-base-review-draft-builder";
export { baseReviewDraftSpecs } from "./sample-base-review-draft-specs";
export type { BaseReviewDraftSpec } from "./sample-base-review-draft-types";

export function buildBaseReviewDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseReviewDraftSpecs.map((spec) => buildBaseReviewDraft(context, spec));
}
