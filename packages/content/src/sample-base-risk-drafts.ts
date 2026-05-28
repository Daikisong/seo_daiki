import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseRiskDraft } from "./sample-base-risk-draft-builder";
import { baseRiskDraftSpecs } from "./sample-base-risk-draft-specs";

export { buildBaseRiskDraft } from "./sample-base-risk-draft-builder";
export { baseRiskDraftSpecs } from "./sample-base-risk-draft-specs";
export type { BaseRiskDraftSpec } from "./sample-base-risk-draft-types";

export function buildBaseRiskDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseRiskDraftSpecs.map((spec) => buildBaseRiskDraft(context, spec));
}
