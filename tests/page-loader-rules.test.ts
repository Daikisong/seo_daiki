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

assert.equal(expectedReviewSectionForLocale("en"), "reviews");
assert.equal(expectedReviewSectionForLocale("es"), "resenas");
assert.equal(expectedReviewSectionForLocale("pt-br"), "analises");

assert.equal(expectedGuideSectionForLocale("en"), "guides");
assert.equal(expectedGuideSectionForLocale("es"), "guias");
assert.equal(expectedGuideSectionForLocale("pt-br"), "guias");

assert.equal(articleMatchesLocalizedSection({ locale: "es", type: "trend" }, "tendencias"), true);
assert.equal(articleMatchesLocalizedSection({ locale: "es", type: "trend" }, "trends"), false);
assert.equal(localizedParamMatchesSection({ locale: "pt-br" }, "buyer_guide", "guias-de-compra"), true);

assert.equal(reviewParamMatchesSection({ locale: "en" }, "reviews"), true);
assert.equal(reviewParamMatchesSection({ locale: "es" }, "reviews"), false);
assert.equal(reviewParamMatchesSection({ locale: "pt-br" }, "analises"), true);

assert.equal(legacyRiskPathForArticle({ locale: "en", slug: "legacy-risk" }), "/en/risk/legacy-risk/");
assert.equal(
  shouldRedirectLegacyRiskArticle({ locale: "en", type: "risk", slug: "aliexpress-chargers-us-buyers" }),
  true
);
assert.equal(shouldRedirectLegacyRiskArticle({ locale: "en", type: "risk", slug: "legacy-risk" }), false);

const route = {
  routeLocale: "en-us",
  section: "guides" as const,
  slug: "aliexpress-chargers-us-buyers"
};
assert.equal(countryRiskRoutePath(route), "/en-us/guides/aliexpress-chargers-us-buyers/");
assert.equal(
  shouldRedirectCountryRiskArticle({ locale: "en", type: "risk", slug: "aliexpress-chargers-us-buyers" }, route),
  false
);
assert.equal(
  shouldRedirectCountryRiskArticle({ locale: "en", type: "risk", slug: "legacy-risk" }, route),
  true
);

assert.equal(previewTokenFromSearchParams({ previewToken: ["first", "second"] }), "first");
assert.equal(previewTokenFromSearchParams({ previewToken: "single" }), "single");
assert.equal(isPreviewTokenAllowed({ previewToken: "single" }, "single"), true);
assert.equal(isPreviewTokenAllowed({ previewToken: "single" }, undefined), false);

assert.equal(canRenderArticleWithPreview({ publishStatus: "published" }, false), true);
assert.equal(canRenderArticleWithPreview({ publishStatus: "draft" }, true), true);
assert.equal(canRenderArticleWithPreview({ publishStatus: "draft" }, false), false);

console.log("Page loader rule unit tests passed");
