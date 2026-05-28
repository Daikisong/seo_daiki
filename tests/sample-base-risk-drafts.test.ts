import assert from "node:assert/strict";
import { buildBaseRiskDrafts } from "../packages/content/src/sample-base-risk-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const riskDrafts = buildBaseRiskDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(riskDrafts.length, 4);
assert.deepEqual(
  riskDrafts.map((draft) => `${draft.locale}:${draft.slug}`),
  [
    "en:aliexpress-chargers-us-buyers",
    "en:aliexpress-chargers-uk-buyers",
    "es:cargadores-aliexpress-espana",
    "pt-br:carregadores-aliexpress-brasil"
  ]
);

for (const draft of riskDrafts) {
  assert.equal(draft.type, "risk");
  assert.equal(draft.productId, "prod-baseus-65w");
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.ok(draft.evidenceIds.some((id) => id.startsWith("risk-")), `${draft.id} should keep a market risk record`);
}

console.log("Sample base risk draft module tests passed");
