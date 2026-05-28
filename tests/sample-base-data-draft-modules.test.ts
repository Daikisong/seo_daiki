import assert from "node:assert/strict";
import {
  baseDataDraftSpecs,
  buildBaseDataDraft,
  buildBaseDataDrafts
} from "../packages/content/src/sample-base-data-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(baseDataDraftSpecs.length, 4);
assert.deepEqual(
  baseDataDraftSpecs.map((spec) => `${spec.type}:${spec.slug}`),
  [
    "data:65w-gan-charger-output-table",
    "data:usb-c-cable-100w-verification-table",
    "data:power-bank-claimed-mah-vs-real-wh",
    "lab:65w-gan-charger-real-output-test"
  ]
);
assert.deepEqual(
  baseDataDraftSpecs.map((spec) => spec.qualityScore),
  [92, 89, 86, 91]
);
assert.equal(baseDataDraftSpecs.every((spec) => spec.locale === "en"), true);
assert.equal(baseDataDraftSpecs.every((spec) => spec.evidenceIds.length >= 4), true);

const singleDraft = buildBaseDataDraft(context, baseDataDraftSpecs[0]);

assert.equal(singleDraft.id, "art-en-data-output");
assert.equal(singleDraft.indexStatus, "index");
assert.equal(singleDraft.publishStatus, "published");
assert.deepEqual(singleDraft.affiliateLinks, []);
assert.deepEqual(singleDraft.evidenceIds, ["vc-baseus-output", "vc-baseus-temp", "vc-ugreen-output", "sc-baseus-65w-title"]);
assert.equal(singleDraft.lastUpdated, "2026-05-25");

const drafts = buildBaseDataDrafts(context);

assert.deepEqual(
  drafts.map((draft) => draft.group),
  ["data-output-table", "data-cable-100w-table", "data-power-bank-mah-wh", "lab-output-test"]
);
assert.equal(drafts.every((draft) => draft.internalLinks.length > 0), true);
assert.equal(drafts.every((draft) => draft.sections.length > 0), true);

console.log("Sample base data draft module split tests passed");
