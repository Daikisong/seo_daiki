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

const product = productFixture("product-1", "65W GaN Charger");

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
  { name: "Relative", url: "https://example.com/en/data/test/" },
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
  return {
    id,
    canonicalName,
    slug: canonicalName.toLowerCase().replaceAll(" ", "-"),
    category: "chargers",
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: []
  };
}
