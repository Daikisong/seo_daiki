import assert from "node:assert/strict";
import type { Article, InternalLink, Product } from "@global-import-lab/types";
import { canonicalForArticle } from "@global-import-lab/seo";
import { validateLocalizationDepthGuard } from "@global-import-lab/validators/localizationDepthGuard";
import { validatePublishStateGuard } from "@global-import-lab/validators/publishStateGuard";
import { runQualityGate } from "@global-import-lab/validators/qualityGate";
import { validateTrendEvidenceGuard } from "@global-import-lab/validators/trendEvidenceGuard";

const article = articleFixture();
const product = productFixture();

const cleanResult = runQualityGate({ article, product });
assert.equal(cleanResult.indexStatus, "index");
assert.equal(cleanResult.issues.length, 0);
assert.equal(cleanResult.breakdown.evidencePack, 15);
assert.equal(cleanResult.breakdown.publishingSafety, 2);

assert.deepEqual(
  validatePublishStateGuard({ ...article, publishStatus: "pending", qualityScore: 79 }).map((issue) => issue.code),
  ["publish_state_not_published", "quality_score_below_index_threshold"]
);

assert.equal(
  validateLocalizationDepthGuard({
    ...article,
    complianceJson: { translationOnly: true }
  })[0]?.code,
  "translation_only_page_noindex_required"
);

assert.equal(
  validateLocalizationDepthGuard({
    ...article,
    translationStatus: "localized",
    localizationDepthScore: 70
  })[0]?.code,
  "localization_depth_below_index_threshold"
);

assert.deepEqual(
  validateTrendEvidenceGuard({
    ...article,
    type: "trend",
    evidenceIds: ["ev-1"],
    internalLinks: [],
    contentMdx: "A trend article without source context."
  }).map((issue) => issue.code),
  ["trend_evidence_missing", "trend_internal_links_low"]
);

assert.deepEqual(
  validateTrendEvidenceGuard({
    ...article,
    type: "deal_watch",
    contentMdx: "Price history, last checked context, buy wait avoid zone. Hurry before it is gone."
  }).map((issue) => issue.code),
  ["deal_watch_fake_urgency"]
);

assert.equal(
  validateTrendEvidenceGuard({
    ...article,
    type: "ingredient_guide",
    contentMdx: "Magnesium article with supported claims only."
  })[0]?.code,
  "ingredient_claim_separation_missing"
);

const blockedResult = runQualityGate({
  article: {
    ...article,
    publishStatus: "pending",
    qualityScore: 79,
    translationStatus: "localized",
    localizationDepthScore: 70
  },
  product
});
assert.equal(blockedResult.indexStatus, "noindex");
assert.ok(blockedResult.issues.some((issue) => issue.code === "publish_state_not_published"));
assert.ok(blockedResult.issues.some((issue) => issue.code === "localization_depth_below_index_threshold"));

console.log("Quality gate composition unit tests passed");

function articleFixture(): Article {
  const base: Article = {
    id: "quality-gate-article",
    locale: "en",
    slug: "usb-c-charger-quality-checks",
    type: "guide",
    title: "USB-C Charger Quality Checks for Safer Buying",
    h1: "USB-C Charger Quality Checks",
    metaDescription: "Evidence-based USB-C charger guide with verified claims, variant traps, price truth, local risk, and safe buying checks.",
    summary: "This guide explains USB-C charger evidence, variant traps, price truth, local risk, and safer alternatives for buyers.",
    contentMdx: "Variant option plug cable evidence, price truth, verified data, country local risk, and alternatives.",
    sections: [
      { heading: "Evidence", body: "Verified evidence for charger output.", evidenceIds: ["ev-1"] },
      { heading: "Variant traps", body: "Variant and plug risk evidence.", evidenceIds: ["ev-2"] },
      { heading: "Price truth", body: "Price and customs risk evidence.", evidenceIds: ["ev-3"] },
      { heading: "Alternatives", body: "Alternative local option evidence.", evidenceIds: ["ev-4"] }
    ],
    jsonLd: {},
    qualityScore: 90,
    indexStatus: "index",
    publishStatus: "published",
    hreflangMap: {},
    internalLinks: links(),
    affiliateLinks: [],
    evidenceIds: ["ev-1", "ev-2", "ev-3", "ev-4"],
    lastUpdated: "2026-05-27"
  };
  const canonical = canonicalForArticle(base);
  return { ...base, canonicalUrl: canonical, hreflangMap: { en: canonical, "x-default": "https://example.com/" } };
}

function links(): InternalLink[] {
  return Array.from({ length: 5 }, (_, index) => ({
    label: `internal ${index}`,
    href: `/en/data/internal-${index}/`,
    reason: "evidence"
  }));
}

function productFixture(): Product {
  return {
    id: "product-1",
    canonicalName: "65W USB-C Charger",
    slug: "65w-usb-c-charger",
    category: "chargers",
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [
      { id: "seller-1", productId: "product-1", claimType: "wattage", claimValue: "65W", capturedAt: "2026-05-27", confidence: 0.8 },
      { id: "seller-2", productId: "product-1", claimType: "plug", claimValue: "US", capturedAt: "2026-05-27", confidence: 0.8 }
    ],
    verifiedClaims: [
      { id: "verified-1", productId: "product-1", testType: "load_test", resultValue: "61", unit: "W", method: "bench", confidence: 0.9 }
    ],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [{ id: "risk-1", productId: "product-1", locale: "en", country: "US", returnRisk: "medium", score: 70 }]
  };
}
