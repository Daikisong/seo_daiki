import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildBaseMethodologyDraft } from "./sample-base-methodology-draft-builder";
import { baseMethodologyDraftSpecs } from "./sample-base-methodology-draft-specs";

export { buildBaseMethodologyDraft } from "./sample-base-methodology-draft-builder";
export { baseMethodologyDraftSpecs } from "./sample-base-methodology-draft-specs";
export type { BaseMethodologyDraftSpec } from "./sample-base-methodology-draft-types";

export function buildBaseMethodologyDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return baseMethodologyDraftSpecs.map((spec) => buildBaseMethodologyDraft(context, spec));
}
