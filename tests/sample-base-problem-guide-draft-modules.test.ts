import assert from "node:assert/strict";
import {
  baseProblemGuideDraftSpecs,
  buildBaseProblemGuideDraft,
  buildBaseProblemGuideDrafts
} from "../packages/content/src/sample-base-problem-guide-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(baseProblemGuideDraftSpecs.length, 3);
assert.deepEqual(
  baseProblemGuideDraftSpecs.map((spec) => `${spec.group}:${spec.slug}`),
  [
    "guide-fake-watts:aliexpress-charger-fake-watts",
    "guide-not-charging:aliexpress-charger-not-charging-laptop",
    "guide-wrong-plug:aliexpress-charger-wrong-plug-option"
  ]
);
assert.deepEqual(
  baseProblemGuideDraftSpecs.map((spec) => spec.qualityScore),
  [86, 84, 84]
);
assert.equal(baseProblemGuideDraftSpecs.every((spec) => spec.locale === "en"), true);
assert.equal(baseProblemGuideDraftSpecs.every((spec) => spec.productId === "prod-baseus-65w"), true);

const singleDraft = buildBaseProblemGuideDraft(context, baseProblemGuideDraftSpecs[0]);

assert.equal(singleDraft.type, "guide");
assert.equal(singleDraft.indexStatus, "index");
assert.equal(singleDraft.publishStatus, "published");
assert.deepEqual(singleDraft.affiliateLinks, []);
assert.equal(singleDraft.lastUpdated, "2026-05-25");
assert.deepEqual(singleDraft.evidenceIds, [
  "sc-baseus-65w-title",
  "var-baseus-45w-trap",
  "vc-baseus-pps-observed",
  "vc-baseus-output"
]);

const drafts = buildBaseProblemGuideDrafts(context);

assert.deepEqual(
  drafts.map((draft) => draft.id),
  ["art-en-guide-fake-watts", "art-en-guide-not-charging", "art-en-guide-wrong-plug"]
);
assert.equal(drafts.every((draft) => draft.internalLinks.length > 0), true);
assert.equal(drafts.every((draft) => draft.sections.length > 0), true);

console.log("Sample base problem guide draft module split tests passed");
