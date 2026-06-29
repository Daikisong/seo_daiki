import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Article, Product } from "../packages/types/src";
import { buildArticleTypeContentContext } from "../apps/web/components/layout/article-type-content-model";
import { TrendBackdataIntro, TrendCommerceSection } from "../apps/web/components/layout/article-type-content-parts";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const currentProduct = productFixture("product-a", "65W Charger", "chargers");
const sameCategoryProduct = productFixture("product-b", "100W Charger", "chargers");
const otherCategoryProduct = productFixture("product-c", "Desk Lamp", "desk");
const reviewArticle = articleFixture({
  id: "article-review-b",
  productId: sameCategoryProduct.id,
  slug: "100w-charger-review",
  type: "review",
  indexStatus: "index"
});

const context = buildArticleTypeContentContext({
  article: articleFixture({ type: "guide" }),
  product: currentProduct,
  allProducts: [currentProduct, sameCategoryProduct, otherCategoryProduct],
  allArticles: [reviewArticle]
});

assert.deepEqual(context.categoryProducts.map((product) => product.id), [currentProduct.id, sameCategoryProduct.id]);
assert.deepEqual(context.alternativeLinks, [
  { product: sameCategoryProduct, href: "/en/reviews/100w-charger-review/" }
]);

const noProductContext = buildArticleTypeContentContext({
  article: articleFixture({ type: "compare" }),
  allProducts: [currentProduct, sameCategoryProduct, otherCategoryProduct],
  allArticles: [reviewArticle]
});

assert.deepEqual(noProductContext.categoryProducts.map((product) => product.id), [
  currentProduct.id,
  sameCategoryProduct.id,
  otherCategoryProduct.id
]);

const trendArticle = articleFixture({
  type: "trend",
  title: "Best GaN charger for travel AliExpress trend",
  h1: "Best GaN charger for travel AliExpress trend",
  metaDescription: "Compare charger prices, wattage claims, travel adapter risk, and AliExpress buying checks.",
  summary: "Searchers want a buyer guide for travel chargers, price checks, product variants, and safe picks.",
  contentMdx: "top 10 best charger buyer guide compare price aliexpress travel adapter",
  sections: [
    { heading: "Trend summary", body: "Readers are comparing GaN charger picks for travel." },
    { heading: "Why it is rising", body: "AliExpress price and fake wattage claims are driving product research." },
    { heading: "What to check", body: "Check SKU, output, plug type, and return risk." }
  ],
  evidenceIds: ["evidence-1", "evidence-2", "evidence-3"]
});
const trendHtml = renderToStaticMarkup(
  React.createElement(TrendCommerceSection, {
    article: trendArticle,
    products: [
      productFixture("product-1", "65W GaN Charger", "chargers"),
      productFixture("product-2", "100W GaN Charger", "chargers"),
      productFixture("product-3", "USB-C Cable", "chargers"),
      productFixture("product-4", "Travel Adapter", "chargers"),
      productFixture("product-5", "Compact 30W GaN Charger", "chargers"),
      productFixture("product-6", "Dual Port 45W Travel Charger", "chargers"),
      productFixture("product-7", "65W Travel Power Bank", "chargers"),
      productFixture("product-8", "GaN Charger Plug Converter", "chargers"),
      productFixture("product-9", "Folding Plug GaN Charger", "chargers"),
      productFixture("product-10", "Premium 140W GaN Charger", "chargers")
    ]
  })
);
const trendBackdataHtml = renderToStaticMarkup(
  React.createElement(TrendBackdataIntro, {
    article: trendArticle,
    products: [
      productFixture("product-1", "65W GaN Charger", "chargers"),
      productFixture("product-2", "100W GaN Charger", "chargers")
    ]
  })
);
assert.ok(trendBackdataHtml.includes("Search intent"));
assert.ok(trendBackdataHtml.includes("Trend evidence"));
assert.ok(trendBackdataHtml.includes("Product backing"));
assert.ok(trendBackdataHtml.includes("Local risk"));
const selectionIndex = trendHtml.indexOf("How we chose these picks");
const comparisonIndex = trendHtml.indexOf("Quick comparison table");
const topTenIndex = trendHtml.indexOf("My in-depth notes on all 10 picks");
const buyingChecklistIndex = trendHtml.indexOf("Buying checklist");
const finalThoughtsIndex = trendHtml.indexOf("Final thoughts on this trend");
const faqIndex = trendHtml.indexOf("Should every trend page include affiliate picks?");
const editorialMethodIndex = trendHtml.indexOf("Editorial method");
assert.ok(trendHtml.includes("Selection gate passed"));
assert.ok(selectionIndex > -1);
assert.ok(comparisonIndex > selectionIndex);
assert.ok(topTenIndex > comparisonIndex);
assert.ok(buyingChecklistIndex > topTenIndex);
assert.ok(finalThoughtsIndex > buyingChecklistIndex);
assert.ok(faqIndex > finalThoughtsIndex);
assert.ok(editorialMethodIndex > faqIndex);
assert.ok(trendHtml.includes("Trend Picks is built as an editorial trend guide"));

console.log("Article type content model tests passed");

function articleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: "article-1",
    locale: "en",
    slug: "test-article",
    type: "guide",
    title: "Test Article",
    h1: "Test H1",
    metaDescription: "Test meta description.",
    summary: "Test summary.",
    contentMdx: "Test body.",
    sections: [{ heading: "Evidence", body: "Evidence body." }],
    qualityScore: 85,
    indexStatus: "index",
    publishStatus: "published",
    hreflangMap: {},
    internalLinks: [],
    affiliateLinks: [],
    evidenceIds: [],
    lastUpdated: "2026-05-27",
    ...overrides
  };
}

function productFixture(id: string, canonicalName: string, category: string): Product {
  const price = 18 + Number(id.replace(/\D/g, "") || 1);
  return {
    id,
    canonicalName,
    slug: canonicalName.toLowerCase().replaceAll(" ", "-"),
    category,
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [
      {
        id: `${id}-verified`,
        productId: id,
        testType: "output",
        resultValue: canonicalName.includes("Cable") ? "100" : "65",
        unit: canonicalName.includes("Cable") ? "W compatible" : "W",
        method: "bench check",
        confidence: 0.9,
        testedAt: "2026-06-18"
      }
    ],
    reviewSignals: [
      {
        id: `${id}-review`,
        productId: id,
        locale: "en",
        topic: "shipping and variant accuracy",
        sentiment: "neutral",
        count: 42,
        confidence: 0.82,
        window: "30d"
      }
    ],
    priceSnapshots: [
      {
        id: `${id}-price`,
        productId: id,
        country: "US",
        currency: "USD",
        price,
        finalPrice: price + 3,
        capturedAt: "2026-06-18"
      }
    ],
    marketRisks: [
      {
        id: `${id}-risk`,
        productId: id,
        locale: "en",
        country: "US",
        certificationRisk: "medium",
        returnRisk: "medium",
        score: 0.34
      }
    ]
  };
}
