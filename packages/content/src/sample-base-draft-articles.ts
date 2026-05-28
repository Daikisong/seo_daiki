import type { ArticleDraft } from "./article-draft-types";
import type { BuildBaseDraftArticlesOptions } from "./sample-base-draft-context";
import { buildBaseComparisonDrafts } from "./sample-base-comparison-drafts";
import { buildBaseDataDrafts } from "./sample-base-data-drafts";
import { buildBaseHubDrafts } from "./sample-base-hub-drafts";
import { buildBaseLocalizedGuideDrafts } from "./sample-base-localized-guide-drafts";
import { buildBaseMethodologyDrafts } from "./sample-base-methodology-drafts";
import { buildBasePendingReviewDrafts } from "./sample-base-pending-review-drafts";
import { buildBaseProblemGuideDrafts } from "./sample-base-problem-guide-drafts";
import { buildBaseReviewDrafts } from "./sample-base-review-drafts";
import { buildBaseRiskDrafts } from "./sample-base-risk-drafts";

export function buildBaseDraftArticles(context: BuildBaseDraftArticlesOptions): ArticleDraft[] {
  return [
    ...buildBaseHubDrafts(context),
    ...buildBaseRiskDrafts(context),
    ...buildBaseReviewDrafts(context),
    ...buildBaseProblemGuideDrafts(context),
    ...buildBaseComparisonDrafts(context),
    ...buildBaseDataDrafts(context),
    ...buildBaseMethodologyDrafts(context),
    ...buildBaseLocalizedGuideDrafts(context),
    ...buildBasePendingReviewDrafts(context)
  ];
}
