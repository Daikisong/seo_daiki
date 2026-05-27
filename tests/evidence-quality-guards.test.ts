import assert from "node:assert/strict";
import type { Article, Product } from "@global-import-lab/types";
import { validateClaimEvidence } from "@global-import-lab/validators/claimEvidence";
import { validateThinAffiliate } from "@global-import-lab/validators/thinAffiliate";

const article: Article = {
  id: "article-1",
  locale: "en",
  slug: "usb-c-charger",
  type: "buyer_guide",
  title: "USB-C Charger Evidence Guide for Safer Import Buying",
  h1: "USB-C Charger Evidence Guide",
  metaDescription: "Evidence-based USB-C charger guide with measured claims, variant traps, price truth, and local risk.",
  summary: "This guide explains charger evidence, variant traps, price truth, verified facts, and local risk.",
  contentMdx: "Variant, evidence, price, verified data, customs risk, plug risk, return risk, and alternatives.",
  sections: [
    { heading: "Verified evidence", body: "Verified 65W charger evidence.", evidenceIds: ["ev-1"] },
    { heading: "Variant trap", body: "Variant and plug risk evidence.", evidenceIds: ["ev-2"] },
    { heading: "Price truth", body: "Price and return risk evidence.", evidenceIds: ["ev-3"] },
    { heading: "Alternatives", body: "Alternative local option evidence.", evidenceIds: ["ev-4"] }
  ],
  jsonLd: {},
  qualityScore: 90,
  indexStatus: "index",
  publishStatus: "published",
  canonicalUrl: "https://example.com/en/buyer-guides/usb-c-charger/",
  hreflangMap: { en: "https://example.com/en/buyer-guides/usb-c-charger/", "x-default": "https://example.com/" },
  internalLinks: [],
  affiliateLinks: [],
  evidenceIds: ["ev-1", "ev-2", "ev-3", "ev-4"],
  lastUpdated: "2026-05-27"
};

assert.deepEqual(validateClaimEvidence({ article, product: productWithClaims() }), []);

assert.equal(
  validateClaimEvidence({
    article: { ...article, sections: article.sections.slice(0, 2), evidenceIds: ["ev-1", "ev-2"] },
    product: productWithClaims()
  })[0]?.code,
  "evidence_claims_low"
);

assert.equal(
  validateClaimEvidence({
    article: { ...article, summary: "Our test says this charger is stable. We tested it in the lab." },
    product: productWithClaims({
      sellerClaims: [
        { id: "seller-1", productId: "product-1", claimType: "wattage", claimValue: "65W", capturedAt: "2026-05-27", confidence: 0.8 },
        { id: "seller-2", productId: "product-1", claimType: "plug", claimValue: "EU", capturedAt: "2026-05-27", confidence: 0.8 },
        { id: "seller-3", productId: "product-1", claimType: "cert", claimValue: "CE", capturedAt: "2026-05-27", confidence: 0.7 }
      ],
      verifiedClaims: []
    })
  })[0]?.code,
  "test_claim_without_verified_evidence"
);

assert.deepEqual(validateThinAffiliate({ article }), []);

assert.equal(
  validateThinAffiliate({
    article: {
      ...article,
      contentMdx: "Seller description only.",
      sections: [{ heading: "Overview", body: "Seller says this charger is useful." }]
    }
  })[0]?.code,
  "thin_affiliate_risk"
);

assert.deepEqual(
  validateThinAffiliate({
    article: {
      ...article,
      contentMdx: "Seller description only.",
      sections: [{ heading: "Overview", body: "Seller says this charger is useful." }]
    },
    product: productWithClaims({ marketRisks: Array.from({ length: 4 }, (_, index) => marketRisk(index)) })
  }),
  []
);

console.log("Evidence quality guard unit tests passed");

function productWithClaims(overrides: Partial<Product> = {}): Product {
  return {
    id: "product-1",
    canonicalName: "65W GaN Charger",
    slug: "65w-gan-charger",
    category: "chargers",
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [
      { id: "seller-1", productId: "product-1", claimType: "wattage", claimValue: "65W", capturedAt: "2026-05-27", confidence: 0.8 },
      { id: "seller-2", productId: "product-1", claimType: "plug", claimValue: "EU", capturedAt: "2026-05-27", confidence: 0.8 }
    ],
    verifiedClaims: [
      { id: "verified-1", productId: "product-1", testType: "load_test", resultValue: "61", unit: "W", method: "bench", confidence: 0.9 }
    ],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [],
    ...overrides
  };
}

function marketRisk(index: number) {
  return {
    id: `risk-${index}`,
    productId: "product-1",
    locale: "en" as const,
    country: "US",
    returnRisk: "medium",
    score: 60
  };
}
