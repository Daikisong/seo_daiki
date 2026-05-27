import assert from "node:assert/strict";
import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import type { QualityGateResult, ValidationIssue } from "@global-import-lab/validators";
import {
  articleStateGateDecision,
  buildArticleStateCandidate,
  needsStrictArticleStateGate,
  selectArticleStateEvidencePack,
  selectArticleStateProduct
} from "../packages/db/src/adminPublishGateModel";

const article: Article = {
  id: "article-a",
  productId: "product-a",
  locale: "en",
  slug: "sample-review",
  type: "review",
  title: "Sample Review",
  h1: "Sample Review",
  metaDescription: "A sample review meta description.",
  summary: "A long enough sample summary for test fixtures.",
  contentMdx: "variant evidence price risk",
  sections: [{ heading: "Evidence", body: "Measured output and risk notes." }],
  qualityScore: 76,
  indexStatus: "pending",
  publishStatus: "draft",
  hreflangMap: {},
  internalLinks: [],
  affiliateLinks: [],
  evidenceIds: [],
  lastUpdated: "2026-05-27"
};

const candidate = buildArticleStateCandidate(article, {
  id: "article-a",
  indexStatus: "index",
  publishStatus: "published",
  qualityScore: 88
});

assert.equal(candidate.indexStatus, "index");
assert.equal(candidate.publishStatus, "published");
assert.equal(candidate.qualityScore, 88);
assert.equal(article.indexStatus, "pending");

assert.equal(needsStrictArticleStateGate(candidate), true);
assert.equal(needsStrictArticleStateGate({ indexStatus: "noindex" }), false);

const product: Product = {
  id: "product-a",
  canonicalName: "Sample Product",
  slug: "sample-product",
  category: "sample",
  identityConfidence: 0.8,
  variants: [],
  sellerClaims: [],
  verifiedClaims: [],
  reviewSignals: [],
  priceSnapshots: [],
  marketRisks: []
};

const evidencePack: EvidencePack = {
  id: "pack-a",
  productId: "product-a",
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
  createdAt: "2026-05-27"
};

assert.equal(selectArticleStateProduct(candidate, [product])?.id, "product-a");
assert.equal(selectArticleStateProduct({ productId: undefined }, [product]), undefined);
assert.equal(selectArticleStateEvidencePack(candidate, [evidencePack])?.id, "pack-a");
assert.equal(selectArticleStateEvidencePack({ productId: "product-a", locale: "es" }, [evidencePack]), undefined);

const passResult: QualityGateResult = {
  score: 91,
  indexStatus: "index",
  issues: [],
  breakdown: {}
};
assert.deepEqual(articleStateGateDecision(article, candidate, passResult), { ok: true });

const gateBlocker: ValidationIssue = {
  code: "missing_evidence",
  message: "Evidence is missing.",
  severity: "blocker"
};
const failResult: QualityGateResult = {
  score: 55,
  indexStatus: "noindex",
  issues: [gateBlocker],
  breakdown: {}
};
const decision = articleStateGateDecision(article, { ...candidate, qualityScore: 70 }, failResult);
assert.equal(decision.ok, false);
if (!decision.ok) {
  assert.equal(decision.before.id, "article-a");
  assert.equal(decision.gateStatus, "noindex");
  assert.equal(decision.gateScore, 55);
  assert.deepEqual(decision.issues.map((issue) => issue.code), [
    "missing_evidence",
    "quality_score_below_index_threshold",
    "quality_gate_not_index"
  ]);
}

console.log("Admin publish gate model unit tests passed");
