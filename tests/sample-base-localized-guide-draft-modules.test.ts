import assert from "node:assert/strict";
import {
  baseLocalizedGuideDraftSpecs,
  buildBaseLocalizedGuideDraft,
  buildBaseLocalizedGuideDrafts
} from "../packages/content/src/sample-base-localized-guide-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(baseLocalizedGuideDraftSpecs.length, 2);
assert.deepEqual(
  baseLocalizedGuideDraftSpecs.map((spec) => `${spec.locale}:${spec.slug}`),
  ["es:cargador-aliexpress-watts-falsos", "pt-br:carregador-aliexpress-watts-falsos"]
);
assert.deepEqual(
  baseLocalizedGuideDraftSpecs.map((spec) => spec.qualityScore),
  [83, 82]
);

const singleDraft = buildBaseLocalizedGuideDraft(context, baseLocalizedGuideDraftSpecs[0]);

assert.equal(singleDraft.type, "guide");
assert.equal(singleDraft.productId, "prod-baseus-65w");
assert.equal(singleDraft.indexStatus, "index");
assert.equal(singleDraft.publishStatus, "published");
assert.deepEqual(singleDraft.affiliateLinks, []);
assert.equal(singleDraft.lastUpdated, "2026-05-25");

const drafts = buildBaseLocalizedGuideDrafts(context);

assert.deepEqual(
  drafts.map((draft) => draft.id),
  ["art-es-guide-fake-watts", "art-pt-guide-fake-watts"]
);
assert.equal(drafts.every((draft) => draft.internalLinks.length > 0), true);
assert.equal(drafts.every((draft) => draft.sections.length > 0), true);

console.log("Sample base localized guide draft module split tests passed");
