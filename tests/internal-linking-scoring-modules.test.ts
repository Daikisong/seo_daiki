import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import { priceBandScore, typeAffinityScore } from "../packages/content/src/internal-linking-scoring";
import { priceBandScore as directPriceBandScore } from "../packages/content/src/internal-linking-price-band-score";
import { typeAffinityScore as directTypeAffinityScore } from "../packages/content/src/internal-linking-type-affinity";
import type { InternalLinkArticle } from "../packages/content/src/internal-linking-types";

assert.equal(typeAffinityScore, directTypeAffinityScore);
assert.equal(priceBandScore, directPriceBandScore);

const source = article({ type: "review" });
assert.equal(typeAffinityScore(source, article({ type: "buyer_guide" })), 16);
assert.equal(typeAffinityScore(source, article({ type: "hub" })), 18);
assert.equal(typeAffinityScore(source, article({ type: "review" })), 4);

const budget = product("budget", 9);
const mid = product("mid", 20);
const premium = product("premium", 80);

assert.equal(priceBandScore(budget, mid), 5);
assert.equal(priceBandScore(mid, { ...mid, id: "mid-2" }), 10);
assert.equal(priceBandScore(budget, premium), 0);
assert.equal(priceBandScore(mid, mid), 0);

console.log("Internal linking scoring module tests passed");

function article(overrides: Partial<InternalLinkArticle> = {}): InternalLinkArticle {
  return {
    group: "test",
    id: "article",
    locale: "en",
    slug: "article",
    type: "guide",
    title: "Article",
    h1: "Article",
    metaDescription: "Article",
    summary: "Article",
    contentMdx: "Article",
    sections: [],
    evidenceIds: [],
    indexStatus: "index",
    publishStatus: "published",
    ...overrides
  };
}

function product(id: string, finalPrice: number): Product {
  return {
    id,
    canonicalName: id,
    slug: id,
    category: "chargers",
    identityConfidence: 1,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [{ id: `${id}-price`, productId: id, currency: "USD", price: finalPrice, finalPrice, capturedAt: "2026-05-28" }],
    marketRisks: []
  };
}
