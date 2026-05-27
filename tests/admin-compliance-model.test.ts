import assert from "node:assert/strict";
import type { Article, EvidencePack, Product } from "../packages/types/src";
import {
  buildSampleComplianceRows,
  isComplianceRelevantIssue,
  shouldSkipSampleComplianceRow
} from "../apps/web/lib/admin/admin-compliance-model";

const product = productFixture("product-1");
const pack = evidencePackFixture(product.id);

const passedArticle = articleFixture({
  id: "article-passed",
  productId: product.id,
  healthSensitivity: "none",
  complianceStatus: "passed"
});
const healthArticle = articleFixture({
  id: "article-health",
  productId: product.id,
  healthSensitivity: "high",
  complianceStatus: "manual_required",
  complianceJson: { healthBlockers: ["health_claim_missing_source"] }
});
const affiliateArticle = articleFixture({
  id: "article-affiliate",
  productId: product.id,
  healthSensitivity: "none",
  complianceStatus: "passed"
});

assert.equal(isComplianceRelevantIssue("health_claim_missing_source"), true);
assert.equal(isComplianceRelevantIssue("unsafe_redirect_target"), true);
assert.equal(isComplianceRelevantIssue("merchant_allowlist_domain"), true);
assert.equal(isComplianceRelevantIssue("thin_content"), false);

assert.equal(shouldSkipSampleComplianceRow(passedArticle, []), true);
assert.equal(shouldSkipSampleComplianceRow(passedArticle, ["affiliate_placement_missing_disclosure"]), false);
assert.equal(shouldSkipSampleComplianceRow(healthArticle, []), false);

const seenInputs: Array<{ product?: Product; evidencePack?: EvidencePack }> = [];
const rows = buildSampleComplianceRows({
  sampleArticles: [passedArticle, healthArticle, affiliateArticle],
  products: [product],
  evidencePacks: [pack],
  evaluateQualityGate(input) {
    seenInputs.push({ product: input.product, evidencePack: input.evidencePack });
    if (input.article.id === "article-affiliate") {
      return {
        issues: [
          { code: "affiliate_placement_missing_disclosure" },
          { code: "thin_content" }
        ]
      };
    }
    return { issues: [] };
  }
});

assert.equal(rows.length, 2);
assert.deepEqual(rows.map((row) => row.id), ["article-health", "article-affiliate"]);
assert.deepEqual(rows[0]?.issues, ["health_claim_missing_source"]);
assert.deepEqual(rows[1]?.issues, ["affiliate_placement_missing_disclosure"]);
assert.equal(seenInputs[0]?.product?.id, product.id);
assert.equal(seenInputs[0]?.evidencePack?.id, pack.id);

const limitedRows = buildSampleComplianceRows({
  sampleArticles: [healthArticle, affiliateArticle],
  products: [product],
  evidencePacks: [pack],
  limit: 1,
  evaluateQualityGate() {
    return { issues: [{ code: "health_claim_missing_source" }] };
  }
});
assert.equal(limitedRows.length, 1);

console.log("Admin compliance model unit tests passed");

function articleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: "article-1",
    locale: "en",
    slug: "test-article",
    type: "guide",
    title: "Test Article",
    h1: "Test H1",
    metaDescription: "Test meta.",
    summary: "Test summary long enough for admin model coverage.",
    contentMdx: "Test content.",
    sections: [{ heading: "Evidence", body: "Evidence body." }],
    qualityScore: 90,
    indexStatus: "index",
    publishStatus: "published",
    healthSensitivity: "none",
    complianceStatus: "passed",
    hreflangMap: {},
    internalLinks: [],
    affiliateLinks: [],
    evidenceIds: [],
    lastUpdated: "2026-05-27",
    ...overrides
  };
}

function productFixture(id: string): Product {
  return {
    id,
    canonicalName: "65W GaN Charger",
    slug: "65w-gan-charger",
    category: "chargers",
    identityConfidence: 0.9,
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: []
  };
}

function evidencePackFixture(productId: string): EvidencePack {
  return {
    id: "pack-1",
    productId,
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
}
