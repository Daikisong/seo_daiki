import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import {
  articleTermSet,
  articleText,
  evidenceOverlap,
  intersectionCount
} from "../packages/content/src/internal-linking-article-text-signals";
import {
  articleCategory,
  priceBand,
  productForArticle
} from "../packages/content/src/internal-linking-product-signals";
import {
  articleRiskProfile,
  riskOverlapScore,
  riskProblemOverlap
} from "../packages/content/src/internal-linking-risk-signals";
import {
  articleCategory as exportedArticleCategory,
  articleRiskProfile as exportedArticleRiskProfile,
  articleTermSet as exportedArticleTermSet,
  evidenceOverlap as exportedEvidenceOverlap,
  intersectionCount as exportedIntersectionCount,
  priceBand as exportedPriceBand,
  productForArticle as exportedProductForArticle,
  riskOverlapScore as exportedRiskOverlapScore,
  riskProblemOverlap as exportedRiskProblemOverlap,
  type InternalLinkArticle
} from "../packages/content/src/internal-linking-rules";

assert.equal(exportedArticleCategory, articleCategory);
assert.equal(exportedArticleRiskProfile, articleRiskProfile);
assert.equal(exportedArticleTermSet, articleTermSet);
assert.equal(exportedEvidenceOverlap, evidenceOverlap);
assert.equal(exportedIntersectionCount, intersectionCount);
assert.equal(exportedPriceBand, priceBand);
assert.equal(exportedProductForArticle, productForArticle);
assert.equal(exportedRiskOverlapScore, riskOverlapScore);
assert.equal(exportedRiskProblemOverlap, riskProblemOverlap);

const charger = productFixture();
const source = articleFixture();
const candidate = articleFixture({ id: "candidate", evidenceIds: ["ev-a", "ev-b"] });

assert.equal(articleText(source).includes("usb-c plug"), true);
assert.equal(articleTermSet(source).has("usb-c"), true);
assert.equal(productForArticle(source, [charger])?.id, charger.id);
assert.equal(articleCategory(source, [charger]), "usb-c-chargers");
assert.equal(priceBand(charger), 2);
assert.equal(evidenceOverlap(source, candidate), 1);
assert.equal(intersectionCount(new Set(["plug", "return"]), new Set(["plug"])), 1);
assert.equal(riskProblemOverlap(new Set(["plug"]), new Set(["plug", "price"])), 1);
assert.equal(articleRiskProfile(source, [charger]).has("plug:medium"), true);
assert.ok(riskOverlapScore(source, candidate, [charger]) > 0);

console.log("Internal linking article signal module tests passed");

function articleFixture(overrides: Partial<InternalLinkArticle> = {}): InternalLinkArticle {
  return {
    group: "charger",
    id: "source",
    productId: "product-risky-charger",
    locale: "en",
    slug: "usb-c-plug-return-guide",
    type: "guide",
    title: "USB-C Plug and Return Guide",
    h1: "USB-C Plug and Return Guide",
    metaDescription: "Variant plug certification and return notes.",
    summary: "Checks plug certification return risks.",
    contentMdx: "usb-c plug certification return customs",
    sections: [{ heading: "Risk checks", body: "Plug certification return policy." }],
    evidenceIds: ["ev-a"],
    indexStatus: "index",
    publishStatus: "published",
    ...overrides
  };
}

function productFixture(): Product {
  return {
    id: "product-risky-charger",
    canonicalName: "Risky 65W USB-C Charger",
    slug: "risky-65w-usb-c-charger",
    category: "usb-c-chargers",
    brandClaim: "Example",
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [{ id: "price-a", productId: "product-risky-charger", currency: "USD", price: 18, finalPrice: 22, capturedAt: "2026-05-27" }],
    marketRisks: [
      {
        id: "risk-a",
        productId: "product-risky-charger",
        locale: "en",
        country: "US",
        plugRisk: "medium",
        customsRisk: "low",
        certificationRisk: "high",
        returnRisk: "medium",
        score: 0.8
      }
    ]
  };
}
