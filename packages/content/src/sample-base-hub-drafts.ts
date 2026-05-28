import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildEnglishCategoryHubDrafts } from "./sample-base-category-hub-drafts";
import { buildChargerHubDrafts } from "./sample-base-charger-hub-drafts";

export { buildEnglishCategoryHubDrafts, englishCategoryHubDraftInputs } from "./sample-base-category-hub-drafts";
export { buildChargerHubDrafts, chargerHubDraftSpecs } from "./sample-base-charger-hub-drafts";
export { buildHubDraft, englishCategoryHubDraft } from "./sample-base-hub-draft-builder";
export type { EnglishCategoryHubDraftInput, HubDraftSpec } from "./sample-base-hub-draft-types";

export function buildBaseHubDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return [...buildChargerHubDrafts(context), ...buildEnglishCategoryHubDrafts(context)];
}
