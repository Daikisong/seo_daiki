import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseComparisonDraft } from "./sample-base-comparison-draft-builder";
import { baseComparisonDraftSpecs } from "./sample-base-comparison-draft-specs";

export { buildBaseComparisonDraft } from "./sample-base-comparison-draft-builder";
export { baseComparisonDraftSpecs } from "./sample-base-comparison-draft-specs";
export type { BaseComparisonDraftSpec } from "./sample-base-comparison-draft-types";

export function buildBaseComparisonDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseComparisonDraftSpecs.map((spec) => buildBaseComparisonDraft(context, spec));
}
