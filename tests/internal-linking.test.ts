import assert from "node:assert/strict";
import type { Article, Product } from "@global-import-lab/types";
import {
  buildProgrammaticInternalLinks,
  dedupeInternalLinks,
  scoreInternalLink,
  type InternalLinkArticle
} from "../packages/content/src/internal-linking";

const productA: Product = {
  id: "product-a",
  canonicalName: "65W USB-C Charger",
  slug: "65w-usb-c-charger",
  category: "usb-c-chargers",
  brandClaim: "Example",
  identityConfidence: 0.9,
  variants: [],
  sellerClaims: [],
  verifiedClaims: [],
  reviewSignals: [],
  priceSnapshots: [{ id: "price-a", productId: "product-a", currency: "USD", price: 18, finalPrice: 22, capturedAt: "2026-05-27" }],
  marketRisks: [
    {
      id: "risk-a",
      productId: "product-a",
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

const productB: Product = {
  ...productA,
  id: "product-b",
  canonicalName: "Budget USB-C Cable",
  slug: "budget-usb-c-cable",
  category: "usb-c-cables",
  priceSnapshots: [{ id: "price-b", productId: "product-b", currency: "USD", price: 6, finalPrice: 6, capturedAt: "2026-05-27" }],
  marketRisks: []
};

const products = [productA, productB];

function article(overrides: Partial<InternalLinkArticle>): InternalLinkArticle {
  const base: InternalLinkArticle = {
    group: "charger",
    id: "source",
    productId: "product-a",
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

const source = article({});
const sameProductRisk = article({
  id: "risk",
  slug: "charger-risk",
  type: "risk",
  title: "USB-C Charger Import Risk",
  evidenceIds: ["ev-output", "ev-risk"]
});
const sameProductData = article({
  id: "data",
  slug: "charger-data",
  type: "data",
  title: "USB-C Charger Output Data",
  evidenceIds: ["ev-output"]
});
const sameCategoryHub = article({
  id: "hub",
  productId: undefined,
  slug: "usb-c-charger-hub",
  type: "hub",
  title: "USB-C Charger Hub",
  evidenceIds: ["ev-hub"]
});
const sameCategoryCompare = article({
  id: "compare",
  slug: "charger-comparison",
  type: "compare",
  title: "USB-C Charger Comparison",
  evidenceIds: ["ev-output"]
});
const sameCategoryGuide = article({
  id: "guide",
  slug: "charger-buying-guide",
  type: "guide",
  title: "USB-C Charger Buying Guide",
  evidenceIds: ["ev-risk"]
});
const unrelatedCable = article({
  id: "cable",
  group: "cable",
  productId: "product-b",
  slug: "budget-cable-review",
  type: "review",
  title: "Budget USB-C Cable Review",
  contentMdx: "cable length e-marker price",
  evidenceIds: ["ev-cable"]
});
const draftCandidate = article({
  id: "draft",
  slug: "draft-candidate",
  type: "guide",
  title: "Draft Candidate",
  publishStatus: "draft"
});
const spanishCandidate = article({
  id: "spanish",
  locale: "es",
  slug: "candidato-es",
  type: "guide",
  title: "Spanish Candidate"
});

assert.ok(scoreInternalLink(source, sameProductRisk, products) > scoreInternalLink(source, unrelatedCable, products));
assert.ok(scoreInternalLink(source, sameProductData, products) > scoreInternalLink(source, unrelatedCable, products));

const links = buildProgrammaticInternalLinks(
  source,
  [
    source,
    sameProductRisk,
    sameProductData,
    sameCategoryHub,
    sameCategoryCompare,
    sameCategoryGuide,
    unrelatedCable,
    draftCandidate,
    spanishCandidate
  ],
  products
);

assert.ok(links.length >= 5);
assert.ok(links.length <= 8);
assert.equal(new Set(links.map((link) => link.href)).size, links.length);
assert.equal(links.some((link) => link.href.includes("draft-candidate")), false);
assert.equal(links.some((link) => link.href.includes("candidato-es")), false);
assert.equal(links.some((link) => link.href.includes("source-review")), false);
assert.ok(links.some((link) => link.href === "/en/risk/charger-risk/" && link.reason === "risk"));
assert.ok(links.some((link) => link.href === "/en/data/charger-data/" && link.reason === "data"));
assert.ok(links.some((link) => link.href === "/en/usb-c-charger-hub/" && link.reason === "category_hub"));

const deduped = dedupeInternalLinks([
  { label: "A", href: "/en/a/", reason: "guide" },
  { label: "A duplicate", href: "/en/a/", reason: "guide" },
  { label: "B", href: "/en/b/", reason: "data" }
]);
assert.deepEqual(deduped.map((link) => link.label), ["A", "B"]);

const realArticleShape: Pick<Article, "locale" | "type" | "slug"> = sameProductRisk;
assert.equal(realArticleShape.slug, "charger-risk");

console.log("Internal linking unit tests passed");
