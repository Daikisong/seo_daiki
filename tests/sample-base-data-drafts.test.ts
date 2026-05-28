import assert from "node:assert/strict";
import { buildBaseDataDrafts } from "../packages/content/src/sample-base-data-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const drafts = buildBaseDataDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(drafts.length, 4);
assert.deepEqual(
  drafts.map((draft) => `${draft.type}:${draft.slug}`),
  [
    "data:65w-gan-charger-output-table",
    "data:usb-c-cable-100w-verification-table",
    "data:power-bank-claimed-mah-vs-real-wh",
    "lab:65w-gan-charger-real-output-test"
  ]
);

for (const draft of drafts) {
  assert.equal(draft.locale, "en");
  assert.equal(draft.publishStatus, "published");
  assert.equal(draft.indexStatus, "index");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.ok(draft.contentMdx.includes("BenchmarkTable") || draft.contentMdx.includes("TestMethodBlock"));
}

console.log("Sample base data draft module tests passed");
