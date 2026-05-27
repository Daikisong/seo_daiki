import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";
import { buildSampleEvidencePacks } from "../packages/content/src/sample-evidence-packs";

const product: Product = {
  id: "prod-sample",
  canonicalName: "Sample Charger",
  slug: "sample-charger",
  category: "usb-c-chargers",
  identityConfidence: 0.8,
  variants: [
    {
      id: "variant-sample",
      productId: "prod-sample",
      optionName: "US plug",
      sourceUrl: "https://example.com/source"
    }
  ],
  sellerClaims: [
    {
      id: "seller-claim-sample",
      productId: "prod-sample",
      claimType: "max_output",
      claimValue: "65W",
      capturedAt: "2026-05-27",
      confidence: 0.7
    }
  ],
  verifiedClaims: [
    {
      id: "verified-claim-sample",
      productId: "prod-sample",
      testType: "sustained_output",
      resultValue: "60",
      method: "load test",
      confidence: 0.8,
      testedAt: "2026-05-27"
    }
  ],
  reviewSignals: [
    {
      id: "review-en",
      productId: "prod-sample",
      locale: "en",
      topic: "heat",
      sentiment: "neutral",
      count: 3,
      confidence: 0.6,
      window: "90d"
    },
    {
      id: "review-es",
      productId: "prod-sample",
      locale: "es",
      topic: "compact",
      sentiment: "positive",
      count: 8,
      confidence: 0.7,
      window: "90d"
    }
  ],
  priceSnapshots: [
    {
      id: "price-sample",
      productId: "prod-sample",
      currency: "USD",
      price: 10,
      capturedAt: "2026-05-27"
    }
  ],
  marketRisks: [
    {
      id: "risk-en",
      productId: "prod-sample",
      locale: "en",
      country: "US",
      returnRisk: "medium",
      score: 0.4
    },
    {
      id: "risk-es",
      productId: "prod-sample",
      locale: "es",
      country: "ES",
      returnRisk: "medium",
      score: 0.5
    }
  ]
};

const links = sampleInternalLinks("es");
assert.equal(links.length, 6);
assert.equal(links[0]?.href, "/es/cargadores-usb-c/");
assert.equal(links.some((link) => link.reason === "methodology"), true);

const sections = sampleSections(["One", "Two", "Three"], ["ev-1", "ev-2", "ev-3"]);
assert.equal(sections.length, 3);
assert.deepEqual(sections[0]?.evidenceIds, ["ev-1", "ev-2"]);
assert.deepEqual(sections[2]?.evidenceIds, ["ev-3"]);
assert.match(sections[1]?.body ?? "", /decision rule/i);

const packs = buildSampleEvidencePacks([product], "2026-05-27");
assert.equal(packs.length, 3);

const spanishPack = packs.find((pack) => pack.locale === "es");
assert.ok(spanishPack);
assert.equal(spanishPack.createdAt, "2026-05-27");
assert.deepEqual(
  spanishPack.packJson.reviewSignals.map((signal) => signal.id),
  ["review-en", "review-es"]
);
assert.deepEqual(
  spanishPack.packJson.marketRisks.map((risk) => risk.id),
  ["risk-en", "risk-es"]
);
assert.equal(spanishPack.packJson.allowedClaims.length, 3);
assert.equal(spanishPack.packJson.forbiddenClaims.length, 3);

console.log("Sample content helper unit tests passed");
