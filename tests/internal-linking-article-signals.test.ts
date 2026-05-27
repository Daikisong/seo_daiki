import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import {
  articleRiskProfile,
  articleTermSet,
  productForArticle,
  riskOverlapScore,
  riskProblemOverlap,
  type InternalLinkArticle
} from "../packages/content/src/internal-linking-rules";

const riskyCharger: Product = {
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
    },
    {
      id: "risk-es",
      productId: "product-risky-charger",
      locale: "es",
      country: "ES",
      plugRisk: "low",
      customsRisk: "medium",
      certificationRisk: "medium",
      returnRisk: "low",
      score: 0.4
    }
  ]
};

function article(overrides: Partial<InternalLinkArticle> = {}): InternalLinkArticle {
  const base: InternalLinkArticle = {
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
    evidenceIds: ["ev-plug"],
    indexStatus: "index",
    publishStatus: "published"
  };
  return { ...base, ...overrides };
}

assert.equal(productForArticle(article(), [riskyCharger])?.id, "product-risky-charger");
assert.equal(productForArticle(article({ productId: undefined }), [riskyCharger]), undefined);

const terms = articleTermSet(article());
assert.equal(terms.has("usb-c"), true);
assert.equal(terms.has("plug"), true);
assert.equal(terms.has("return"), true);

const riskProfile = articleRiskProfile(article(), [riskyCharger]);
assert.equal(riskProfile.has("plug"), true);
assert.equal(riskProfile.has("plug:medium"), true);
assert.equal(riskProfile.has("certification:high"), true);
assert.equal(riskProfile.has("return:medium"), true);
assert.equal(riskProfile.has("customs:low"), false);

assert.equal(riskProblemOverlap(new Set(["plug", "return", "missing"]), new Set(["plug", "price"])), 1);

const candidate = article({
  id: "candidate",
  slug: "certification-return-checklist",
  title: "Certification Return Checklist",
  contentMdx: "plug certification return",
  sections: [{ heading: "Checklist", body: "Certification return and plug checks." }]
});

assert.ok(riskOverlapScore(article(), candidate, [riskyCharger]) > 0);

console.log("Internal linking article signal tests passed");
