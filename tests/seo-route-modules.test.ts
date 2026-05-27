import assert from "node:assert/strict";
import {
  articlePath,
  canonicalForArticle,
  getSiteUrl,
  hreflangKeyForArticle,
  legacyLocaleDefaultMarketPath,
  localizedSectionPathForArticleType,
  regionalRiskRouteForArticle,
  sectionHrefForArticle,
  sectionPathForArticle
} from "@global-import-lab/seo";
import {
  localizedBuyerGuideSection,
  localizedDealWatchSection,
  localizedGuideSection,
  localizedIngredientGuideSection,
  localizedReviewSection,
  localizedSectionByType,
  localizedTrendSection
} from "../packages/seo/src/article-localized-section-routes";

assert.equal(sectionPathForArticle({ locale: "es", type: "review" }), "resenas");
assert.equal(sectionPathForArticle({ locale: "pt-br", type: "guide" }), "guias");
assert.equal(sectionPathForArticle({ locale: "en", type: "hub" }), "");
assert.equal(localizedSectionPathForArticleType("trend", "pt-br"), "tendencias");
assert.equal(localizedSectionPathForArticleType("data", "en"), undefined);
assert.equal(localizedSectionByType.review, localizedReviewSection);
assert.equal(localizedSectionByType.guide, localizedGuideSection);
assert.equal(localizedSectionByType.trend, localizedTrendSection);
assert.equal(localizedSectionByType.buyer_guide, localizedBuyerGuideSection);
assert.equal(localizedSectionByType.deal_watch, localizedDealWatchSection);
assert.equal(localizedSectionByType.ingredient_guide, localizedIngredientGuideSection);

assert.equal(articlePath({ locale: "es", type: "review", slug: "cargador" }), "/es/resenas/cargador/");
assert.equal(articlePath({ locale: "en", type: "hub", slug: "chargers" }), "/en/chargers/");
assert.equal(canonicalForArticle({ locale: "en", type: "guide", slug: "charger" }, "https://site.example"), "https://site.example/en/guides/charger/");

const regionalRoute = regionalRiskRouteForArticle({
  locale: "en",
  type: "risk",
  slug: "aliexpress-chargers-us-buyers"
});

assert.equal(regionalRoute?.routeLocale, "en-us");
assert.equal(hreflangKeyForArticle({ locale: "en", type: "risk", slug: "aliexpress-chargers-us-buyers" }), "en-US");
assert.equal(sectionHrefForArticle({ locale: "en", type: "risk", slug: "aliexpress-chargers-us-buyers" }), "/en-us/guides/");
assert.equal(articlePath({ locale: "en", type: "risk", slug: "aliexpress-chargers-us-buyers" }), "/en-us/guides/aliexpress-chargers-us-buyers/");

assert.equal(legacyLocaleDefaultMarketPath("en"), "/us/en/");
assert.equal(legacyLocaleDefaultMarketPath("es"), "/es/es/");
assert.equal(legacyLocaleDefaultMarketPath("pt-br"), "/br/pt-br/");
assert.equal(legacyLocaleDefaultMarketPath("fr"), undefined);

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
delete process.env.NEXT_PUBLIC_SITE_URL;
assert.equal(getSiteUrl(), "https://example.com");
process.env.NEXT_PUBLIC_SITE_URL = "https://example.test/";
assert.equal(getSiteUrl(), "https://example.test");
if (originalSiteUrl === undefined) {
  delete process.env.NEXT_PUBLIC_SITE_URL;
} else {
  process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
}

console.log("SEO route module unit tests passed");
