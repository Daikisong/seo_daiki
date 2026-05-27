import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import {
  articleCategory,
  linkReasonForArticleType,
  priceBand,
  scoreInternalLink,
  sortScoredInternalLinks,
  type InternalLinkArticle
} from "../packages/content/src/internal-linking-rules";

const charger: Product = {
  id: "product-charger",
  canonicalName: "65W USB-C Charger",
  slug: "65w-usb-c-charger",
  category: "usb-c-chargers",
  brandClaim: "Example",
  identityConfidence: 0.9,
  variants: [],
  sellerClaims: [],
  verifiedClaims: [],
  reviewSignals: [],
  priceSnapshots: [{ id: "price-a", productId: "product-charger", currency: "USD", price: 18, finalPrice: 22, capturedAt: "2026-05-27" }],
  marketRisks: [
    {
      id: "risk-a",
      productId: "product-charger",
      locale: "en",
      country: "US",
      plugRisk: "medium",
      customsRisk: "low",
      certificationRisk: "medium",
      returnRisk: "medium",
      score: 0.5
    }
  ]
};

const cable: Product = {
  ...charger,
  id: "product-cable",
  canonicalName: "Budget USB-C Cable",
  slug: "budget-usb-c-cable",
  category: "usb-c-cables",
  priceSnapshots: [{ id: "price-b", productId: "product-cable", currency: "USD", price: 6, finalPrice: 6, capturedAt: "2026-05-27" }],
  marketRisks: []
};

function article(overrides: Partial<InternalLinkArticle> = {}): InternalLinkArticle {
  const base: InternalLinkArticle = {
    group: "charger",
    id: "source",
    productId: "product-charger",
    locale: "en",
    slug: "source-review",
    type: "review",
    title: "65W USB-C Charger Review",
    h1: "65W USB-C Charger Review",
    metaDescription: "Review with variant plug cable certification return price evidence.",
    summary: "Checks variant plug cable certification return price evidence.",
    contentMdx: "variant plug cable certification return price evidence usb-c charger",
    sections: [{ heading: "Variant evidence", body: "Plug cable return certification risk." }],
    evidenceIds: ["ev-output", "ev-risk"],
    indexStatus: "index",
    publishStatus: "published"
  };
  return { ...base, ...overrides };
}

assert.equal(linkReasonForArticleType("hub"), "category_hub");
assert.equal(linkReasonForArticleType("deal_watch"), "deal");
assert.equal(linkReasonForArticleType("ingredient_guide"), "ingredient");
assert.equal(linkReasonForArticleType("review"), "alternative");

assert.equal(articleCategory(article({ productId: "product-charger" }), [charger, cable]), "usb-c-chargers");
assert.equal(
  articleCategory(
    article({
      productId: undefined,
      title: "Magnesium supplement guide",
      h1: "Magnesium supplement guide",
      metaDescription: "Supplement evidence and iHerb availability notes.",
      summary: "Supplement evidence checks.",
      contentMdx: "iHerb magnesium supplement checks",
      sections: [{ heading: "Supplement evidence", body: "Magnesium notes." }],
      evidenceIds: ["ev-supplement"],
      slug: "magnesium-supplement"
    }),
    [charger, cable]
  ),
  "supplements"
);
assert.equal(
  articleCategory(
    article({
      productId: undefined,
      title: "Unknown topic",
      h1: "Unknown topic",
      metaDescription: "Evergreen planning notes.",
      summary: "Evergreen planning.",
      contentMdx: "unrelated evergreen planning",
      sections: [{ heading: "Planning", body: "Evergreen notes." }],
      evidenceIds: ["ev-planning"],
      slug: "unknown-topic"
    }),
    [charger, cable]
  ),
  undefined
);

assert.equal(priceBand({ ...charger, priceSnapshots: [{ ...charger.priceSnapshots[0], finalPrice: 9.99 }] }), 1);
assert.equal(priceBand(charger), 2);
assert.equal(priceBand({ ...charger, priceSnapshots: [{ ...charger.priceSnapshots[0], finalPrice: 35 }] }), 3);
assert.equal(priceBand({ ...charger, priceSnapshots: [{ ...charger.priceSnapshots[0], finalPrice: 80 }] }), 4);
assert.equal(priceBand({ ...charger, priceSnapshots: [] }), undefined);

const source = article();
const sameProductRisk = article({
  id: "risk",
  slug: "charger-risk",
  type: "risk",
  title: "USB-C Charger Import Risk",
  evidenceIds: ["ev-output", "ev-risk"]
});
const unrelatedCable = article({
  id: "cable",
  group: "cable",
  productId: "product-cable",
  slug: "budget-cable-review",
  type: "review",
  title: "Budget USB-C Cable Review",
  contentMdx: "cable length e-marker price",
  evidenceIds: ["ev-cable"]
});

assert.ok(scoreInternalLink(source, sameProductRisk, [charger, cable]) > scoreInternalLink(source, unrelatedCable, [charger, cable]));

assert.deepEqual(
  [
    { candidate: article({ id: "z-review", slug: "z-review", type: "review" }), score: 10 },
    { candidate: article({ id: "hub", slug: "hub", type: "hub" }), score: 10 },
    { candidate: article({ id: "top", slug: "top", type: "guide" }), score: 11 }
  ]
    .sort(sortScoredInternalLinks)
    .map((row) => row.candidate.id),
  ["top", "hub", "z-review"]
);

console.log("Internal linking rule unit tests passed");
