import assert from "node:assert/strict";
import test from "node:test";

import { selectRecommendationCandidateProducts } from "./recommendation-product-selection";
import type { Article, Product } from "./types";

test("selects only main products in the article product category", () => {
  const selected = selectRecommendationCandidateProducts(
    article({ productCategory: "chargers" }),
    [
      product({
        id: "charger-main",
        category: "chargers",
        productRole: "main",
      }),
      product({
        id: "charger-accessory",
        category: "chargers",
        productRole: "accessory",
      }),
      product({ id: "cooling-main", category: "cooling", productRole: "main" }),
    ],
  );

  assert.deepEqual(
    selected.map((item) => item.id),
    ["charger-main"],
  );
});

test("returns no recommendation products when the article has no product category", () => {
  const selected = selectRecommendationCandidateProducts(
    article({ productCategory: undefined }),
    [
      product({
        id: "charger-main",
        category: "chargers",
        productRole: "main",
      }),
      product({
        id: "charger-accessory",
        category: "chargers",
        productRole: "accessory",
      }),
      product({ id: "cooling-main", category: "cooling", productRole: "main" }),
    ],
  );

  assert.deepEqual(selected, []);
});

function article(overrides: Partial<Article> = {}): Article {
  return {
    id: "article",
    authorId: "jacob",
    productEvidenceById: "trendbrief-editors",
    editedById: "trendbrief-editors",
    locale: "en",
    slug: "article",
    type: "trend",
    title: "Article",
    h1: "Article",
    metaDescription: "Article",
    summary: "Article",
    affiliateDisclosure: "Disclosure",
    imageUrl: "https://example.com/image.jpg",
    productCategory: "chargers",
    contentMdx: "article",
    sections: [],
    faqs: [],
    expertCopy: {
      topPicksHeading: "Top picks",
      topPicksIntro: "Intro",
      topPicksRule: "Rule",
      quickListIntro: "Quick list intro",
      comparisonHeading: "Comparison",
      comparisonIntro: "Intro",
      comparisonFootnote: "Footnote",
      inDepthHeading: "In depth",
      topThreeHeading: "Top three",
      finalThoughtsHeading: "Final thoughts",
      finalThoughts: [],
      buyingChecklistHeading: "Checklist",
      buyingChecklist: [],
      updateLogHeading: "Update log",
      updateLog: [],
    },
    evidenceIds: [],
    affiliateLinks: [],
    lastUpdated: "2026-06-30",
    indexStatus: "index",
    publishStatus: "published",
    ...overrides,
  };
}

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: "product",
    canonicalName: "Product",
    exactVariant: "Product Variant",
    category: "chargers",
    productRole: "main",
    merchantUrl: "https://example.com/product",
    merchantUrlKind: "merchant-product-page",
    sourceUrl: "https://example.com/source",
    sourceLabel: "Source",
    reviewSourceUrl: "https://example.com/review",
    reviewSourceLabel: "Review",
    marketplaceSourceLabel: "Marketplace",
    priceCheckedAt: "2026-06-30",
    imageUrl: "https://example.com/product.jpg",
    imageAlt: "Product",
    priceLabel: "$1",
    priceState: "checked",
    regionFit: "Region",
    returnRiskLabel: "Return",
    evidenceLevel: "public-spec",
    evidenceBasis: "Evidence",
    specSummary: "Spec",
    reviewSummary: "Review",
    safetyNote: "Safety",
    bestFor: "Best for",
    whyRecommend: "Why",
    whoFits: "Fits",
    whoShouldSkip: "Skip",
    repeatedComplaints: [],
    warrantyReturnNote: "Warranty",
    marketplaceNote: "Marketplace",
    keyCheck: "Check",
    keyFeatures: [],
    editorialRankLabel: "Rank",
    expertReviewTake: "Take",
    editorialPros: [],
    editorialCons: [],
    verifiedClaims: [],
    priceSnapshots: [],
    reviewSignals: [],
    marketRisks: [],
    ...overrides,
  };
}
