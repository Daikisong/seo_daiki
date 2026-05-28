import assert from "node:assert/strict";
import {
  baseRiskDraftSpecs,
  buildBaseRiskDraft,
  buildBaseRiskDrafts
} from "../packages/content/src/sample-base-risk-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(baseRiskDraftSpecs.length, 4);
assert.deepEqual(
  baseRiskDraftSpecs.map((spec) => `${spec.locale}:${spec.slug}`),
  [
    "en:aliexpress-chargers-us-buyers",
    "en:aliexpress-chargers-uk-buyers",
    "es:cargadores-aliexpress-espana",
    "pt-br:carregadores-aliexpress-brasil"
  ]
);
assert.deepEqual(
  baseRiskDraftSpecs.map((spec) => spec.qualityScore),
  [88, 86, 87, 87]
);
assert.equal(baseRiskDraftSpecs.every((spec) => spec.productId === "prod-baseus-65w"), true);
assert.equal(baseRiskDraftSpecs.every((spec) => spec.evidenceIds.some((id) => id.startsWith("risk-"))), true);

const singleDraft = buildBaseRiskDraft(context, baseRiskDraftSpecs[1]);

assert.equal(singleDraft.id, "art-en-risk-usb-c-import-uk");
assert.equal(singleDraft.type, "risk");
assert.equal(singleDraft.indexStatus, "index");
assert.equal(singleDraft.publishStatus, "published");
assert.deepEqual(singleDraft.affiliateLinks, []);
assert.equal(singleDraft.lastUpdated, "2026-05-25");

const drafts = buildBaseRiskDrafts(context);

assert.deepEqual(
  drafts.map((draft) => draft.group),
  ["risk-usb-c-import", "risk-usb-c-import-uk", "risk-usb-c-import", "risk-usb-c-import"]
);
assert.equal(drafts.every((draft) => draft.internalLinks.length > 0), true);
assert.equal(drafts.every((draft) => draft.sections.length > 0), true);

console.log("Sample base risk draft module split tests passed");
