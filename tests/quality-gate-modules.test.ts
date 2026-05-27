import assert from "node:assert/strict";
import type { Article, InternalLink, Product } from "@global-import-lab/types";
import { canonicalForArticle } from "@global-import-lab/seo";
import { runQualityGate } from "../packages/validators/src/qualityGate";
import { indexStatusForQualityGate } from "../packages/validators/src/qualityGateIndexStatus";
import {
  collectQualityGateIssues,
  flattenQualityGateIssues
} from "../packages/validators/src/qualityGateIssueCollectors";
import {
  qualityGateScoreBreakdown,
  sumQualityGateScore
} from "../packages/validators/src/qualityGateScore";

const input = { article: articleFixture(), product: productFixture() };
const issueGroups = collectQualityGateIssues(input);
const issues = flattenQualityGateIssues(issueGroups);
const breakdown = qualityGateScoreBreakdown(input, issueGroups);
const score = sumQualityGateScore(breakdown);
const indexStatus = indexStatusForQualityGate(score, issues);
const composed = runQualityGate(input);

assert.deepEqual(issues, composed.issues);
assert.deepEqual(breakdown, composed.breakdown);
assert.equal(score, composed.score);
assert.equal(indexStatus, composed.indexStatus);
assert.equal(breakdown.evidencePack, 15);
assert.equal(indexStatusForQualityGate(70, []), "pending");
assert.equal(indexStatusForQualityGate(64, []), "noindex");
assert.equal(indexStatusForQualityGate(90, [{ code: "block", message: "Blocked", severity: "blocker" }]), "noindex");

const blockedGroups = collectQualityGateIssues({
  ...input,
  article: { ...input.article, publishStatus: "pending", qualityScore: 79 }
});
assert.equal(blockedGroups.publishStateIssues[0]?.code, "publish_state_not_published");
assert.ok(flattenQualityGateIssues(blockedGroups).some((issue) => issue.severity === "blocker"));

console.log("Quality gate module tests passed");

function articleFixture(): Article {
  const base: Article = {
    id: "quality-gate-module-article",
    locale: "en",
    slug: "usb-c-charger-quality-module-checks",
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
