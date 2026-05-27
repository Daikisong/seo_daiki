import assert from "node:assert/strict";
import type { Article, Product } from "../packages/types/src";
import { buildArticleTypeContentContext } from "../apps/web/components/layout/article-type-content-model";

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
  return {
    id,
    canonicalName,
    slug: canonicalName.toLowerCase().replaceAll(" ", "-"),
    category,
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: []
  };
}
