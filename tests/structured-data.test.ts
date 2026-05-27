import assert from "node:assert/strict";
import type { Article, Product } from "@global-import-lab/types";
import { canonicalForArticle } from "@global-import-lab/seo";
import { validateStructuredData } from "@global-import-lab/validators/structuredDataValidation";

const baseArticle: Article = {
  id: "article-structured-data",
  locale: "en",
  slug: "usb-c-charger-evidence",
  type: "guide",
  title: "USB-C Charger Evidence Guide for Safer Buying",
  h1: "USB-C Charger Evidence Guide",
  metaDescription: "A practical evidence guide for checking USB-C charger safety, power claims, and buying risks before choosing a product.",
  summary: "This guide explains charger safety, evidence signals, and buyer risk checks before choosing a USB-C charger.",
  contentMdx: "Evidence guide for USB-C charger safety, power claims, and local buying risks.",
  sections: [
    { heading: "Safety evidence", body: "Check charger certification and power delivery evidence.", evidenceIds: ["ev-1"] },
    { heading: "Buyer checks", body: "Compare plug type, cable support, and warranty details.", evidenceIds: ["ev-2"] }
  ],
  jsonLd: {},
  qualityScore: 90,
  indexStatus: "index",
  publishStatus: "published",
  hreflangMap: {},
  internalLinks: [
    { label: "USB-C charger dataset", href: "/en/data/usb-c-charger-dataset/", reason: "data" },
    { label: "Charger comparison", href: "/en/compare/usb-c-chargers/", reason: "compare" }
  ],
  affiliateLinks: [],
  evidenceIds: ["ev-1", "ev-2", "ev-3"],
  lastUpdated: "2026-05-27"
};

const product: Product = {
  id: "product-1",
  canonicalName: "Example 65W USB-C Charger",
  slug: "example-65w-usb-c-charger",
  category: "consumer-tech",
  brandClaim: "ExampleBrand",
  identityConfidence: 0.92,
  variants: [
    {
      id: "variant-1",
      productId: "product-1",
      optionName: "US plug",
      wattageClaim: 65,
      plugType: "US",
      sourceUrl: "https://merchant.example/charger",
      riskFlags: ["verify cable inclusion"]
    }
  ],
  sellerClaims: [],
  verifiedClaims: [
    {
      id: "claim-1",
      productId: "product-1",
      testType: "power delivery",
      resultValue: "65",
      unit: "W",
      method: "manual evidence review",
      confidence: 0.9
    }
  ],
  reviewSignals: [],
  priceSnapshots: [
    {
      id: "price-1",
      productId: "product-1",
      currency: "USD",
      price: 29.99,
      finalPrice: 27.99,
      capturedAt: "2026-05-27T00:00:00.000Z"
    }
  ],
  marketRisks: []
};

function article(overrides: Partial<Article>): Article {
  return {
    ...baseArticle,
    ...overrides,
    hreflangMap: {
      en: canonicalForArticle({ ...baseArticle, ...overrides }),
      "x-default": "https://example.com/",
      ...overrides.hreflangMap
    }
  };
}

function issueCodes(result: ReturnType<typeof validateStructuredData>) {
  return result.map((issue) => issue.code);
}

const reviewArticle = article({
  id: "review-article",
  slug: "example-65w-usb-c-charger-review",
  type: "review",
  title: "Example 65W USB-C Charger Review With Evidence Checks",
  h1: "Example 65W USB-C Charger Review"
});
assert.deepEqual(validateStructuredData({ article: reviewArticle, product }), []);
assert.deepEqual(issueCodes(validateStructuredData({ article: reviewArticle })), ["schema_review_product_missing"]);

const dataArticle = article({
  id: "data-article",
  slug: "usb-c-charger-dataset",
  type: "data",
  title: "USB-C Charger Dataset for Evidence Based Comparison",
  h1: "USB-C Charger Dataset"
});
assert.deepEqual(validateStructuredData({ article: dataArticle }), []);

const hubArticle = article({
  id: "hub-article",
  slug: "usb-c-charger-hub",
  type: "hub",
  title: "USB-C Charger Research Hub for Safer Buying",
  h1: "USB-C Charger Research Hub"
});
assert.deepEqual(validateStructuredData({ article: hubArticle }), []);

const compareArticle = article({
  id: "compare-article",
  slug: "usb-c-charger-comparison",
  type: "compare",
  title: "USB-C Charger Comparison by Evidence and Risk",
  h1: "USB-C Charger Comparison"
});
assert.deepEqual(validateStructuredData({ article: compareArticle }), []);

console.log("Structured data validation unit tests passed");
