import assert from "node:assert/strict";
import {
  articleMatchesLocalizedSection,
  canRenderArticleWithPreview,
  countryRiskRoutePath,
  expectedGuideSectionForLocale,
  expectedReviewSectionForLocale,
  isPreviewTokenAllowed,
  legacyRiskPathForArticle,
  localizedParamMatchesSection,
  previewTokenFromSearchParams,
  reviewParamMatchesSection,
  shouldRedirectCountryRiskArticle,
  shouldRedirectLegacyRiskArticle
} from "../apps/web/lib/content/page-loader-rules";
import {
  articleMatchesLocalizedSection as directArticleMatchesLocalizedSection,
  expectedGuideSectionForLocale as directExpectedGuideSectionForLocale,
  expectedReviewSectionForLocale as directExpectedReviewSectionForLocale,
  localizedParamMatchesSection as directLocalizedParamMatchesSection,
  reviewParamMatchesSection as directReviewParamMatchesSection
} from "../apps/web/lib/content/page-loader-localized-rules";
import {
  canRenderArticleWithPreview as directCanRenderArticleWithPreview,
  isPreviewTokenAllowed as directIsPreviewTokenAllowed,
  previewTokenFromSearchParams as directPreviewTokenFromSearchParams
} from "../apps/web/lib/content/page-loader-preview-rules";
import {
  countryRiskRoutePath as directCountryRiskRoutePath,
  legacyRiskPathForArticle as directLegacyRiskPathForArticle,
  shouldRedirectCountryRiskArticle as directShouldRedirectCountryRiskArticle,
  shouldRedirectLegacyRiskArticle as directShouldRedirectLegacyRiskArticle
} from "../apps/web/lib/content/page-loader-risk-rules";

assert.equal(articleMatchesLocalizedSection, directArticleMatchesLocalizedSection);
assert.equal(expectedGuideSectionForLocale, directExpectedGuideSectionForLocale);
assert.equal(expectedReviewSectionForLocale, directExpectedReviewSectionForLocale);
assert.equal(localizedParamMatchesSection, directLocalizedParamMatchesSection);
assert.equal(reviewParamMatchesSection, directReviewParamMatchesSection);
assert.equal(canRenderArticleWithPreview, directCanRenderArticleWithPreview);
assert.equal(isPreviewTokenAllowed, directIsPreviewTokenAllowed);
assert.equal(previewTokenFromSearchParams, directPreviewTokenFromSearchParams);
assert.equal(countryRiskRoutePath, directCountryRiskRoutePath);
assert.equal(legacyRiskPathForArticle, directLegacyRiskPathForArticle);
assert.equal(shouldRedirectCountryRiskArticle, directShouldRedirectCountryRiskArticle);
assert.equal(shouldRedirectLegacyRiskArticle, directShouldRedirectLegacyRiskArticle);

assert.equal(expectedReviewSectionForLocale("pt-br"), "analises");
assert.equal(expectedGuideSectionForLocale("es"), "guias");
assert.equal(articleMatchesLocalizedSection({ locale: "es", type: "trend" }, "tendencias"), true);
assert.equal(localizedParamMatchesSection({ locale: "pt-br" }, "buyer_guide", "guias-de-compra"), true);
assert.equal(reviewParamMatchesSection({ locale: "es" }, "resenas"), true);

const route = {
  routeLocale: "en-us",
  section: "guides" as const,
  slug: "aliexpress-chargers-us-buyers"
};

assert.equal(legacyRiskPathForArticle({ locale: "en", slug: "legacy-risk" }), "/en/risk/legacy-risk/");
assert.equal(countryRiskRoutePath(route), "/en-us/guides/aliexpress-chargers-us-buyers/");
assert.equal(
  shouldRedirectCountryRiskArticle({ locale: "en", type: "risk", slug: "aliexpress-chargers-us-buyers" }, route),
  false
);
assert.equal(shouldRedirectLegacyRiskArticle({ locale: "en", type: "risk", slug: "legacy-risk" }), false);

assert.equal(previewTokenFromSearchParams({ previewToken: ["first", "second"] }), "first");
assert.equal(isPreviewTokenAllowed({ previewToken: "first" }, "first"), true);
assert.equal(canRenderArticleWithPreview({ publishStatus: "draft" }, false), false);

console.log("Page loader rule module tests passed");
