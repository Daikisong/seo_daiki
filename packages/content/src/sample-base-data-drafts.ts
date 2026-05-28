import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseDataDraft } from "./sample-base-data-draft-builder";
import { baseDataDraftSpecs } from "./sample-base-data-draft-specs";

export { buildBaseDataDraft } from "./sample-base-data-draft-builder";
export { baseDataDraftSpecs } from "./sample-base-data-draft-specs";
export type { BaseDataDraftSpec } from "./sample-base-data-draft-types";

export function buildBaseDataDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseDataDraftSpecs.map((spec) => buildBaseDataDraft(context, spec));
}
