import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseProblemGuideDraft } from "./sample-base-problem-guide-draft-builder";
import { baseProblemGuideDraftSpecs } from "./sample-base-problem-guide-draft-specs";

export { buildBaseProblemGuideDraft } from "./sample-base-problem-guide-draft-builder";
export { baseProblemGuideDraftSpecs } from "./sample-base-problem-guide-draft-specs";
export type { BaseProblemGuideDraftSpec } from "./sample-base-problem-guide-draft-types";

export function buildBaseProblemGuideDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseProblemGuideDraftSpecs.map((spec) => buildBaseProblemGuideDraft(context, spec));
}
