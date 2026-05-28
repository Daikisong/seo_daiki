import assert from "node:assert/strict";
import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";
import {
  buildTrendBlogArticle,
  buildTrendBlogDraftArticles
} from "../packages/content/src/trend-blog-article-builder";
import type { TrendBlogArticleSpec } from "../packages/content/src/trend-blog-article-types";

const updatedAt = "2030-03-04";
const context = {
  updatedAt,
  internalLinks(locale: Locale): InternalLink[] {
    return [{ label: `${locale} hub`, href: `/${locale}/`, reason: "builder-test" }];
  },
  sections(headings: string[], evidenceIds: string[]): ArticleSection[] {
    return headings.map((heading, index) => ({
      heading,
      body: `Section ${index + 1}`,
      evidenceIds: evidenceIds.slice(0, index + 1)
    }));
  }
};

const baseSpec = {
  group: "builder-test",
  locale: "en",
  slug: "builder-test",
  title: "Builder test",
  h1: "Builder test",
  metaDescription: "Builder test meta",
  summary: "Builder test summary",
  contentMdx: "builder test content",
  evidenceIds: ["ev-a", "ev-b"],
  headings: ["Signal", "Evidence"]
} satisfies Omit<TrendBlogArticleSpec, "id" | "type">;

const trendSpec: TrendBlogArticleSpec = {
  ...baseSpec,
  id: "art-builder-trend",
  type: "trend"
};

const buyerSpec: TrendBlogArticleSpec = {
  ...baseSpec,
  id: "art-builder-buyer",
  type: "buyer_guide",
  productId: "prod-builder",
  affiliateLabel: "Check offer",
  affiliateHref: "https://example.com/offer"
};

const partialAffiliateSpec: TrendBlogArticleSpec = {
  ...baseSpec,
  id: "art-builder-partial-affiliate",
  type: "deal_watch",
  affiliateLabel: "Missing href"
};

const ingredientSpec: TrendBlogArticleSpec = {
  ...baseSpec,
  id: "art-builder-ingredient",
  type: "ingredient_guide"
};

const trendArticle = buildTrendBlogArticle(trendSpec, context);
assert.equal(trendArticle.id, trendSpec.id);
assert.equal(trendArticle.indexStatus, "index");
assert.equal(trendArticle.publishStatus, "published");
assert.equal(trendArticle.qualityScore, 84);
assert.equal(trendArticle.healthSensitivity, "none");
assert.equal(trendArticle.complianceStatus, "unchecked");
assert.equal(trendArticle.complianceJson, undefined);
assert.equal(trendArticle.affiliateLinks.length, 0);
assert.deepEqual(trendArticle.sections.map((section) => section.heading), ["Signal", "Evidence"]);
assert.deepEqual(trendArticle.sections[1]?.evidenceIds, ["ev-a", "ev-b"]);
assert.equal(trendArticle.internalLinks[0]?.reason, "builder-test");
assert.equal(trendArticle.lastUpdated, updatedAt);

const buyerArticle = buildTrendBlogArticle(buyerSpec, context);
assert.equal(buyerArticle.productId, "prod-builder");
assert.deepEqual(buyerArticle.affiliateLinks, [
  {
    label: "Check offer",
    href: "https://example.com/offer",
    rel: "sponsored nofollow"
  }
]);

const partialAffiliateArticle = buildTrendBlogArticle(partialAffiliateSpec, context);
assert.equal(partialAffiliateArticle.affiliateLinks.length, 0);

const ingredientArticle = buildTrendBlogArticle(ingredientSpec, context);
assert.equal(ingredientArticle.healthSensitivity, "high");
assert.equal(ingredientArticle.complianceStatus, "passed");
assert.deepEqual(ingredientArticle.complianceJson, {
  manualApproval: true,
  disclaimerRequired: true,
  healthClaimGuard: "passed"
});

const builtArticles = buildTrendBlogDraftArticles(context, [trendSpec, buyerSpec, ingredientSpec]);
assert.deepEqual(
  builtArticles.map((article) => article.id),
  ["art-builder-trend", "art-builder-buyer", "art-builder-ingredient"]
);

console.log("Trend blog article builder unit tests passed");
