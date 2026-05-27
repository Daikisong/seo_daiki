import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import {
  eligibleInternalLinkCandidates as facadeEligibleInternalLinkCandidates,
  scoredInternalLinkCandidates as facadeScoredInternalLinkCandidates,
  diversifyInternalLinks as facadeDiversifyInternalLinks,
  ensureMinimumInternalLinks as facadeEnsureMinimumInternalLinks
} from "../packages/content/src/internal-linking-selection";
import { eligibleInternalLinkCandidates } from "../packages/content/src/internal-linking-candidate-eligibility";
import { scoredInternalLinkCandidates } from "../packages/content/src/internal-linking-candidate-scoring";
import { diversifyInternalLinks } from "../packages/content/src/internal-linking-diversity";
import { ensureMinimumInternalLinks } from "../packages/content/src/internal-linking-minimum-links";
import type { InternalLinkArticle } from "../packages/content/src/internal-linking-rules";

assert.equal(facadeEligibleInternalLinkCandidates, eligibleInternalLinkCandidates);
assert.equal(facadeScoredInternalLinkCandidates, scoredInternalLinkCandidates);
assert.equal(facadeDiversifyInternalLinks, diversifyInternalLinks);
assert.equal(facadeEnsureMinimumInternalLinks, ensureMinimumInternalLinks);

const charger: Product = {
  id: "charger",
  canonicalName: "65W USB-C Charger",
  slug: "65w-usb-c-charger",
  category: "usb-c-chargers",
  brandClaim: "Example",
  identityConfidence: 0.9,
  variants: [],
  sellerClaims: [],
  verifiedClaims: [],
  reviewSignals: [],
  priceSnapshots: [{ id: "price-a", productId: "charger", currency: "USD", price: 20, finalPrice: 22, capturedAt: "2026-05-27" }],
  marketRisks: []
};

const source = article({ id: "source", slug: "source-review", type: "review", productId: "charger" });
const candidates = [
  source,
  article({ id: "risk", slug: "charger-risk", type: "risk", productId: "charger", evidenceIds: ["ev-risk"] }),
  article({ id: "data", slug: "charger-data", type: "data", productId: "charger", evidenceIds: ["ev-risk"] }),
  article({ id: "guide", slug: "charger-guide", type: "guide", productId: "charger" }),
  article({ id: "hub", slug: "charger-hub", type: "hub", productId: undefined }),
  article({ id: "review-a", slug: "review-a", type: "review", productId: "charger" }),
  article({ id: "review-b", slug: "review-b", type: "review", productId: "charger" }),
  article({ id: "draft", slug: "draft", type: "guide", publishStatus: "draft" }),
  article({ id: "noindex", slug: "noindex", type: "guide", indexStatus: "noindex" }),
  article({ id: "es", slug: "es", type: "guide", locale: "es" })
];

const eligible = eligibleInternalLinkCandidates(source, candidates);
assert.deepEqual(
  eligible.map((candidate) => candidate.id),
  ["risk", "data", "guide", "hub", "review-a", "review-b"]
);

const scored = scoredInternalLinkCandidates(source, eligible, [charger]);
assert.ok(scored.some((row) => row.candidate.id === "risk"));
assert.ok(scored.every((row) => row.score > 0));

const diversified = diversifyInternalLinks(source, scored, 5);
assert.equal(diversified.length, 5);
assert.equal(new Set(diversified.map((row) => row.candidate.slug)).size, diversified.length);
assert.ok(
  countByType(diversified.map((row) => row.candidate)).every((count) => count <= 2),
  "diversified links should not overfill one article type"
);

const minimum = ensureMinimumInternalLinks(
  [{ label: "Existing", href: "/en/risk/charger-risk/", reason: "risk" }],
  eligible,
  5
);
assert.equal(minimum.length, 5);
assert.equal(new Set(minimum.map((link) => link.href)).size, minimum.length);

console.log("Internal linking selection module tests passed");

function article(overrides: Partial<InternalLinkArticle> = {}): InternalLinkArticle {
  return {
    group: "charger",
    id: "article",
    productId: "charger",
    locale: "en",
    slug: "article",
    type: "guide",
    title: "USB-C charger article",
    h1: "USB-C charger article",
    metaDescription: "USB-C charger evidence, price, return and certification notes.",
    summary: "USB-C charger evidence notes.",
    contentMdx: "usb-c charger evidence price return certification",
    sections: [{ heading: "Evidence", body: "USB-C charger output evidence." }],
    evidenceIds: ["ev-output"],
    indexStatus: "index",
    publishStatus: "published",
    ...overrides
  };
}

function countByType(articles: InternalLinkArticle[]) {
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.type, (counts.get(article.type) ?? 0) + 1);
  }
  return [...counts.values()];
}
