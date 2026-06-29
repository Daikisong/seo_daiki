import assert from "node:assert/strict";
import type { Article, Product } from "../packages/types/src";
import {
  affiliateTrackingHrefForArticle,
  breadcrumbItemsForArticle,
  buildArticlePageJsonLd,
  internalLinkSchemaItems,
  reviewPathForProduct,
  unsafeAffiliateTargetRedirectAllowed
} from "../apps/web/lib/content/article-page-model";
import { linkedProductSnippetJsonLd } from "../apps/web/lib/content/article-page-jsonld-products";
import { buildTrendRecommendationModel } from "../apps/web/lib/content/trend-recommendations";

const product = productFixture("product-1", "65W GaN Charger");
const expectedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const indexedReview = articleFixture({
  id: "article-review-indexed",
  productId: product.id,
  slug: "65w-gan-charger-review",
  type: "review",
  indexStatus: "index"
});
const fallbackReview = articleFixture({
  id: "article-review-fallback",
  productId: product.id,
  slug: "65w-gan-charger-draft-review",
  type: "review",
  indexStatus: "noindex"
});

assert.deepEqual(breadcrumbItemsForArticle(articleFixture({ type: "hub", slug: "usb-c-chargers" })), [
  { label: "Home", href: "/en/" },
  { label: "hub", href: "/en/usb-c-chargers/" },
  { label: "Test H1", href: "/en/usb-c-chargers/" }
]);

assert.deepEqual(breadcrumbItemsForArticle(articleFixture({ type: "guide", slug: "charger-guide" })), [
  { label: "Home", href: "/en/" },
  { label: "guide", href: "/en/guides/" },
  { label: "Test H1", href: "/en/guides/charger-guide/" }
]);

assert.equal(
  affiliateTrackingHrefForArticle(
    { label: "Merchant", href: "https://merchant.example/item", rel: "sponsored nofollow", placementId: "placement-1" },
    indexedReview,
    { CONTENT_SOURCE: "database", NODE_ENV: "production" }
  ),
  "/api/affiliate-click?placementId=placement-1"
);

assert.equal(
  affiliateTrackingHrefForArticle(
    { label: "Merchant", href: "https://merchant.example/item", rel: "sponsored nofollow" },
    indexedReview,
    { NODE_ENV: "production", ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT: "true" }
  ),
  "https://merchant.example/item"
);

const unsafeHref = affiliateTrackingHrefForArticle(
  { label: "Merchant", href: "https://merchant.example/item", rel: "sponsored nofollow" },
  indexedReview,
  { NODE_ENV: "development", ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT: "true" }
);
assert.match(unsafeHref, /^\/api\/affiliate-click\?/);
assert.equal(new URL(`https://example.com${unsafeHref}`).searchParams.get("target"), "https://merchant.example/item");
assert.equal(new URL(`https://example.com${unsafeHref}`).searchParams.get("productId"), product.id);
assert.equal(unsafeAffiliateTargetRedirectAllowed({ NODE_ENV: "development", ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT: "true" }), true);
assert.equal(unsafeAffiliateTargetRedirectAllowed({ NODE_ENV: "production", ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT: "true" }), false);

assert.equal(reviewPathForProduct("en", product, [fallbackReview, indexedReview]), "/en/reviews/65w-gan-charger-review/");
assert.equal(reviewPathForProduct("en", product, [fallbackReview]), "/en/reviews/65w-gan-charger-draft-review/");
assert.equal(reviewPathForProduct("es", product, [indexedReview]), undefined);

const linkArticle = articleFixture({
  internalLinks: [
    { label: "Relative", href: "/en/data/test/", reason: "data" },
    { label: "Absolute", href: "https://external.example/page", reason: "guide" }
  ]
});
assert.deepEqual(internalLinkSchemaItems(linkArticle), [
  { name: "Relative", url: `${expectedSiteUrl}/en/data/test/` },
  { name: "Absolute", url: "https://external.example/page" }
]);

const compareJsonLd = buildArticlePageJsonLd(
  articleFixture({
    type: "compare",
    slug: "compare-chargers",
    internalLinks: [{ label: "Review", href: "/en/reviews/65w-gan-charger-review/", reason: "alternative" }]
  }),
  undefined,
  [product],
  [indexedReview]
);
assert.equal(compareJsonLd.length, 4);
assert.equal((compareJsonLd[1] as Record<string, unknown>)["@type"], "ItemList");
assert.equal(linkedProductSnippetJsonLd(indexedReview, [product], [indexedReview]).length, 1);

const trendJsonLd = buildArticlePageJsonLd(
  articleFixture({
    type: "trend",
    slug: "charger-trend",
    title: "Best GaN charger for travel AliExpress trend: top 10 picks",
    h1: "Best GaN charger for travel AliExpress trend: top 10 picks",
    metaDescription:
      "Quick answer, price evidence, wattage checks, travel adapter risks, and top 10 AliExpress-style charger picks.",
    summary:
      "Quick answer: start with verified GaN charger records, compare every exact SKU, and avoid mystery bundles without return terms.",
    contentMdx:
      "quick answer top 10 best charger buyer guide compare price prices where to buy aliexpress deal picks product products travel adapter cable evidence wattage final price return risk",
    sections: [
      {
        heading: "Quick answer",
        body:
          "The best first pick is the verified 65W GaN Charger because it has output evidence, price history, and variant checks.",
        evidenceIds: ["evidence-1", "evidence-2"]
      },
      {
        heading: "Fresh price and evidence check",
        body: "Use price snapshots, review signals, certification risk, and seller evidence before clicking an AliExpress offer.",
        evidenceIds: ["evidence-3"]
      },
      {
        heading: "Top 10 recommendation checklist",
        body: "The top 10 should lead with verified charger records and include supporting cable, adapter, and backup options.",
        evidenceIds: ["evidence-4"]
      }
    ],
    evidenceIds: ["evidence-1", "evidence-2", "evidence-3", "evidence-4"],
    internalLinks: [
      { label: "Charger output data", href: "/en/data/charger-output/", reason: "data" },
      { label: "Import risk notes", href: "/en/risk/charger-import-risk/", reason: "risk" },
      { label: "Testing method", href: "/en/methodology/charger-testing/", reason: "methodology" },
      { label: "Buyer guide", href: "/en/guides/usb-c-charger-guide/", reason: "guide" }
    ],
    affiliateLinks: [
      {
        label: "Check live AliExpress price",
        href: "https://www.aliexpress.com/wholesale?SearchText=travel%20GaN%20charger",
        rel: "sponsored nofollow",
        placementStatus: "approved",
        disclosureShown: true,
        offerStatus: "active",
        merchantSlug: "aliexpress"
      }
    ]
  }),
  undefined,
  [
    productFixture("product-1", "65W GaN Charger"),
    productFixture("product-2", "100W GaN Charger"),
    productFixture("product-3", "USB-C Cable"),
    productFixture("product-4", "Travel Adapter"),
    productFixture("product-5", "Compact 30W GaN Charger"),
    productFixture("product-6", "Dual Port 45W Travel Charger"),
    productFixture("product-7", "65W Travel Power Bank"),
    productFixture("product-8", "GaN Charger Plug Converter"),
    productFixture("product-9", "Folding Plug GaN Charger"),
    productFixture("product-10", "Premium 140W GaN Charger")
  ],
  []
);
assert.equal(trendJsonLd.length, 4);
assert.deepEqual((trendJsonLd[0] as Record<string, unknown>).author, {
  "@type": "Person",
  name: "Jacob"
});
assert.equal((trendJsonLd[1] as Record<string, unknown>)["@type"], "ItemList");
assert.equal(((trendJsonLd[1] as { itemListElement: unknown[] }).itemListElement).length, 10);
assert.match(JSON.stringify(trendJsonLd[1]), /#trend-pick-1/);
assert.equal((trendJsonLd[2] as Record<string, unknown>)["@type"], "FAQPage");
assert.equal((trendJsonLd[3] as Record<string, unknown>)["@type"], "BreadcrumbList");

const ineligibleTrendArticle = articleFixture({
  type: "trend",
  slug: "storm-warning-update",
  title: "Storm warning travel disruption update",
  h1: "Storm warning travel disruption update",
  metaDescription: "Current weather warning and transport disruption summary.",
  summary: "This is an informational weather update, not a shopping guide.",
  contentMdx: "storm warning weather disruption closure emergency update",
  sections: [{ heading: "What changed", body: "Check official weather and transport sources before traveling." }]
});
const ineligibleTrendModel = buildTrendRecommendationModel(ineligibleTrendArticle, [product]);
const ineligibleTrendJsonLd = buildArticlePageJsonLd(ineligibleTrendArticle, undefined, [product], []);
assert.equal(ineligibleTrendModel.eligible, false);
assert.equal(ineligibleTrendJsonLd.length, 2);
assert.equal((ineligibleTrendJsonLd[1] as Record<string, unknown>)["@type"], "BreadcrumbList");

console.log("Article page model unit tests passed");

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

function productFixture(id: string, canonicalName: string): Product {
  const price = 18 + Number(id.replace(/\D/g, "") || 1);
  return {
    id,
    canonicalName,
    slug: canonicalName.toLowerCase().replaceAll(" ", "-"),
    category: "chargers",
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
