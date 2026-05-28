import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseLocalizedGuideDraft } from "./sample-base-localized-guide-draft-builder";
import { baseLocalizedGuideDraftSpecs } from "./sample-base-localized-guide-draft-specs";

export { buildBaseLocalizedGuideDraft } from "./sample-base-localized-guide-draft-builder";
export { baseLocalizedGuideDraftSpecs } from "./sample-base-localized-guide-draft-specs";
export type { BaseLocalizedGuideDraftSpec } from "./sample-base-localized-guide-draft-types";

export function buildBaseLocalizedGuideDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseLocalizedGuideDraftSpecs.map((spec) => buildBaseLocalizedGuideDraft(context, spec));
}
