import assert from "node:assert/strict";
import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";
import {
  buildTrendBlogArticle,
  buildTrendBlogDraftArticles,
  trendBlogArticleSpecs
} from "../packages/content/src/trend-blog-article-fixtures";

const updatedAt = "2030-02-03";
const context = {
  updatedAt,
  internalLinks(locale: Locale): InternalLink[] {
    return [{ label: `${locale} trend hub`, href: `/${locale}/trends/travel-gan-charger/`, reason: "trend" }];
  },
  sections(headings: string[], evidenceIds: string[]): ArticleSection[] {
    return headings.map((heading, index) => ({
      heading,
      body: `Trend fixture section ${index + 1}`,
      evidenceIds: evidenceIds.slice(index, index + 2)
    }));
  }
};

assert.equal(trendBlogArticleSpecs.length, 12);
assert.deepEqual([...new Set(trendBlogArticleSpecs.map((spec) => spec.locale))].sort(), ["en", "es", "pt-br"]);
assert.deepEqual([...new Set(trendBlogArticleSpecs.map((spec) => spec.group))].sort(), [
  "buyer-guide-travel-gan",
  "deal-watch-65w-gan",
  "ingredient-magnesium-glycinate",
  "trend-travel-gan-charger"
]);

const articles = buildTrendBlogDraftArticles(context);
assert.equal(articles.length, 12);
assert.equal(articles.every((article) => article.indexStatus === "index"), true);
assert.equal(articles.every((article) => article.publishStatus === "published"), true);
assert.equal(articles.every((article) => article.qualityScore === 84), true);
assert.equal(articles.every((article) => article.lastUpdated === updatedAt), true);
assert.equal(articles.every((article) => article.internalLinks[0]?.reason === "trend"), true);

const trendArticles = articles.filter((article) => article.type === "trend");
assert.equal(trendArticles.length, 3);
const monetizedTrendArticles = trendArticles.filter((article) => article.affiliateLinks.length > 0);
assert.equal(monetizedTrendArticles.length, 1);
assert.equal(monetizedTrendArticles[0]?.id, "art-en-trend-travel-gan-charger");
assert.equal(monetizedTrendArticles[0]?.affiliateLinks[0]?.placementStatus, "approved");
assert.equal(monetizedTrendArticles[0]?.affiliateLinks[0]?.offerStatus, "active");
assert.equal(trendArticles.filter((article) => article.affiliateLinks.length === 0).length, 2);
assert.equal(trendArticles.every((article) => article.healthSensitivity === "none"), true);
assert.equal(trendArticles.every((article) => article.complianceStatus === "unchecked"), true);

const monetizedArticles = articles.filter((article) => ["buyer_guide", "deal_watch", "ingredient_guide"].includes(article.type));
assert.equal(monetizedArticles.length, 9);
assert.equal(monetizedArticles.every((article) => article.affiliateLinks.length === 1), true);
assert.equal(monetizedArticles.every((article) => article.affiliateLinks[0]?.rel === "sponsored nofollow"), true);

const ingredientArticles = articles.filter((article) => article.type === "ingredient_guide");
assert.equal(ingredientArticles.length, 3);
for (const article of ingredientArticles) {
  assert.equal(article.healthSensitivity, "high");
  assert.equal(article.complianceStatus, "passed");
  assert.deepEqual(article.complianceJson, {
    manualApproval: true,
    disclaimerRequired: true,
    healthClaimGuard: "passed"
  });
  assert.ok(article.contentMdx.includes("not medical advice"));
}

const spanishBuyerGuide = articles.find((article) => article.id === "art-es-buyer-guide-travel-gan");
assert.ok(spanishBuyerGuide);
assert.equal(spanishBuyerGuide.locale, "es");
assert.equal(spanishBuyerGuide.slug, "guia-compra-cargador-gan-viaje-evidencia");
assert.equal(spanishBuyerGuide.productId, "prod-baseus-65w");
assert.equal(spanishBuyerGuide.sections[0]?.heading, "Marco de decisión");

const customArticle = buildTrendBlogArticle(
  {
    group: "custom-trend",
    id: "art-custom-trend",
    locale: "en",
    slug: "custom-trend",
    type: "trend",
    title: "Custom trend",
    h1: "Custom trend",
    metaDescription: "Custom trend meta",
    summary: "Custom trend summary",
    contentMdx: "trend evidence",
    evidenceIds: ["ev-a", "ev-b"],
    headings: ["Signal", "Evidence"]
  },
  context
);
assert.equal(customArticle.affiliateLinks.length, 0);
assert.deepEqual(customArticle.sections.map((section) => section.heading), ["Signal", "Evidence"]);
assert.equal(customArticle.lastUpdated, updatedAt);

console.log("Trend blog article fixture unit tests passed");
