import assert from "node:assert/strict";
import {
  loadArticlePage,
  loadArticlePageForLocalizedSection,
  loadCountryRiskGuidePage,
  loadGuidePageForFixedLocale,
  loadGuidePageForSection,
  loadLegacyRiskPage,
  loadReviewPageForSection
} from "../apps/web/lib/content/article-page-loaders";
import { loadArticlePage as directLoadArticlePage } from "../apps/web/lib/content/article-page-base-loader";
import { loadArticlePageForLocalizedSection as directLoadArticlePageForLocalizedSection } from "../apps/web/lib/content/article-localized-section-loader";
import {
  loadCountryRiskGuidePage as directLoadCountryRiskGuidePage,
  loadLegacyRiskPage as directLoadLegacyRiskPage
} from "../apps/web/lib/content/article-risk-loaders";
import {
  loadGuidePageForFixedLocale as directLoadGuidePageForFixedLocale,
  loadGuidePageForSection as directLoadGuidePageForSection,
  loadReviewPageForSection as directLoadReviewPageForSection
} from "../apps/web/lib/content/article-review-guide-loaders";

assert.equal(loadArticlePage, directLoadArticlePage);
assert.equal(loadArticlePageForLocalizedSection, directLoadArticlePageForLocalizedSection);
assert.equal(loadCountryRiskGuidePage, directLoadCountryRiskGuidePage);
assert.equal(loadLegacyRiskPage, directLoadLegacyRiskPage);
assert.equal(loadGuidePageForFixedLocale, directLoadGuidePageForFixedLocale);
assert.equal(loadGuidePageForSection, directLoadGuidePageForSection);
assert.equal(loadReviewPageForSection, directLoadReviewPageForSection);

console.log("Article page loader module export tests passed");
