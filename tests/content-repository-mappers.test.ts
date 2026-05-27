import assert from "node:assert/strict";
import { affiliateLinksFromJson, offerStatus, placementStatus } from "../packages/db/src/contentRepositoryAffiliateLinks";
import { mapDbArticle, mapDbEvidencePack, mapDbProduct } from "../packages/db/src/contentRepositoryMappers";
import {
  jsonArray,
  jsonObject,
  localizationDepthScoreFromJson,
  translationStatusFromJson
} from "../packages/db/src/contentRepositoryJson";

assert.deepEqual(jsonArray<string>(["one", "two"]), ["one", "two"]);
assert.deepEqual(jsonArray<string>({ value: "not-array" }), []);
assert.deepEqual(jsonObject({ localizationDepthScore: 82 }), { localizationDepthScore: 82 });
assert.deepEqual(jsonObject(["not-object"]), {});
assert.equal(localizationDepthScoreFromJson({ localizationDepthScore: 91 }), 91);
assert.equal(localizationDepthScoreFromJson({ localizationDepthScore: Number.NaN }), undefined);
assert.equal(translationStatusFromJson({ translationStatus: "approved" }), "approved");
assert.equal(translationStatusFromJson({ translationStatus: "unknown" }), undefined);

assert.equal(placementStatus("approved"), "approved");
assert.equal(placementStatus("paused"), "draft");
assert.equal(offerStatus("active"), "active");
assert.equal(offerStatus("missing"), "draft");

const enrichedLinks = affiliateLinksFromJson(
  [
    {
      label: "Buy charger",
      href: "https://old.example/charger",
      rel: "nofollow",
      placementId: "placement-1"
    },
    {
      label: "Matched by label",
      href: "https://old.example/label",
      rel: "nofollow"
    },
    {
      label: "Unmatched",
      href: "https://old.example/unmatched",
      rel: "nofollow"
    }
  ],
  [
    {
      id: "placement-1",
      anchorText: "Different label",
      rel: "sponsored nofollow",
      disclosureShown: true,
      status: "approved",
      offer: {
        affiliateUrl: "https://merchant.example/charger?tag=demo",
        status: "active",
        healthSensitive: false,
        merchant: {
          slug: "demo-merchant",
          allowedDomains: ["merchant.example"]
        }
      }
    },
    {
      id: "placement-2",
      anchorText: "Matched by label",
      rel: "sponsored nofollow",
      disclosureShown: false,
      status: "paused",
      offer: {
        affiliateUrl: "https://merchant.example/label?tag=demo",
        status: "retired",
        healthSensitive: true,
        merchant: {
          slug: "label-merchant",
          allowedDomains: "not-array"
        }
      }
    }
  ]
);

assert.equal(enrichedLinks[0]?.href, "https://merchant.example/charger?tag=demo");
assert.equal(enrichedLinks[0]?.placementStatus, "approved");
assert.equal(enrichedLinks[0]?.offerStatus, "active");
assert.deepEqual(enrichedLinks[0]?.merchantAllowedDomains, ["merchant.example"]);
assert.equal(enrichedLinks[1]?.href, "https://merchant.example/label?tag=demo");
assert.equal(enrichedLinks[1]?.placementStatus, "draft");
assert.equal(enrichedLinks[1]?.offerStatus, "draft");
assert.deepEqual(enrichedLinks[1]?.merchantAllowedDomains, []);
assert.equal(enrichedLinks[2]?.href, "https://old.example/unmatched");

const mappedArticle = mapDbArticle({
  id: "article-1",
  productId: null,
  locale: "en",
  slug: "charger-guide",
  type: "guide",
  title: "Charger guide",
  h1: null,
  metaDescription: null,
  summary: null,
  contentMdx: "Body",
  sections: [{ heading: "Intro", body: "Start" }],
  jsonLd: { "@type": "Article" },
  qualityScore: 78,
  indexStatus: "noindex",
  publishStatus: "draft",
  healthSensitivity: "none",
  complianceStatus: "passed",
  complianceJson: { localizationDepthScore: 88, translationStatus: "localized" },
  canonicalUrl: null,
  hreflangMap: { en: "/en/guides/charger-guide/" },
  internalLinks: [{ label: "Method", href: "/methodology/", reason: "methodology" }],
  affiliateLinks: [{ label: "Buy charger", href: "https://old.example/charger", rel: "nofollow" }],
  evidenceIds: ["evidence-1"],
  lastUpdated: null,
  updatedAt: new Date("2026-05-28T00:00:00.000Z"),
  affiliatePlacements: []
});

assert.equal(mappedArticle.h1, "Charger guide");
assert.equal(mappedArticle.metaDescription, "");
assert.equal(mappedArticle.summary, "");
assert.equal(mappedArticle.lastUpdated, "2026-05-28");
assert.equal(mappedArticle.localizationDepthScore, 88);
assert.equal(mappedArticle.translationStatus, "localized");
assert.deepEqual(mappedArticle.evidenceIds, ["evidence-1"]);

const mappedProduct = mapDbProduct({
  id: "product-1",
  canonicalName: "65W charger",
  slug: "65w-charger",
  category: "chargers",
  brandClaim: null,
  identityConfidence: 0.83,
  imageHash: null,
  variants: [
    {
      id: "variant-1",
      productId: "product-1",
      sourceSku: null,
      optionName: "US plug",
      wattageClaim: 65,
      plugType: "US",
      cableIncluded: true,
      sourceUrl: "https://merchant.example/charger",
      affiliateUrl: null,
      sellerName: null,
      sellerId: null,
      riskFlags: ["plug_mismatch"]
    }
  ],
  sellerClaims: [
    {
      id: "seller-claim-1",
      productId: "product-1",
      claimType: "wattage",
      claimValue: "65W",
      rawText: null,
      sourceUrl: null,
      capturedAt: new Date("2026-05-27T00:00:00.000Z"),
      confidence: 0.7
    }
  ],
  verifiedClaims: [
    {
      id: "verified-claim-1",
      productId: "product-1",
      testType: "load",
      resultValue: "62W",
      unit: "W",
      method: "lab",
      evidenceUrl: null,
      confidence: 0.8,
      testedAt: new Date("2026-05-26T00:00:00.000Z")
    }
  ],
  reviewSignals: [
    {
      id: "review-1",
      productId: "product-1",
      locale: "en",
      topic: "heat",
      sentiment: "negative",
      count: 12,
      confidence: 0.6,
      window: null
    }
  ],
  priceSnapshots: [
    {
      id: "price-1",
      productId: "product-1",
      variantId: null,
      country: "US",
      currency: "USD",
      price: "19.99",
      shipping: null,
      coupon: "2.00",
      finalPrice: "17.99",
      capturedAt: new Date("2026-05-25T00:00:00.000Z")
    }
  ],
  marketRisks: [
    {
      id: "risk-1",
      productId: "product-1",
      locale: "en",
      country: "US",
      plugRisk: null,
      customsRisk: null,
      certificationRisk: "needs UL verification",
      returnRisk: null,
      localAlternativeNote: null,
      score: 0.4
    }
  ]
});

assert.equal(mappedProduct.variants[0]?.riskFlags?.[0], "plug_mismatch");
assert.equal(mappedProduct.sellerClaims[0]?.capturedAt, "2026-05-27");
assert.equal(mappedProduct.verifiedClaims[0]?.testedAt, "2026-05-26");
assert.equal(mappedProduct.reviewSignals[0]?.sentiment, "negative");
assert.equal(mappedProduct.priceSnapshots[0]?.price, 19.99);
assert.equal(mappedProduct.priceSnapshots[0]?.coupon, 2);
assert.equal(mappedProduct.marketRisks[0]?.certificationRisk, "needs UL verification");

const mappedEvidencePack = mapDbEvidencePack({
  id: "pack-1",
  productId: null,
  locale: "en",
  packJson: {
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [],
    allowedClaims: [],
    forbiddenClaims: []
  },
  createdAt: new Date("2026-05-24T00:00:00.000Z")
});

assert.equal(mappedEvidencePack.productId, undefined);
assert.equal(mappedEvidencePack.createdAt, "2026-05-24");

console.log("Content repository mapper unit tests passed");
