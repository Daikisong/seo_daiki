import assert from "node:assert/strict";
import {
  buildBaseHubDrafts,
  buildChargerHubDrafts,
  buildEnglishCategoryHubDrafts,
  chargerHubDraftSpecs,
  englishCategoryHubDraftInputs
} from "../packages/content/src/sample-base-hub-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

assert.equal(chargerHubDraftSpecs.length, 3);
assert.deepEqual(chargerHubDraftSpecs.map((spec) => spec.locale), ["en", "es", "pt-br"]);
assert.deepEqual(chargerHubDraftSpecs.map((spec) => spec.qualityScore), [91, 88, 87]);

assert.equal(englishCategoryHubDraftInputs.length, 4);
assert.deepEqual(
  englishCategoryHubDraftInputs.filter((input) => input.indexStatus === "pending").map((input) => input.id),
  ["art-en-hub-electric-screwdrivers", "art-en-hub-smart-home-sensors"]
);

const chargerHubs = buildChargerHubDrafts(context);
const categoryHubs = buildEnglishCategoryHubDrafts(context);
const allHubs = buildBaseHubDrafts(context);

assert.equal(chargerHubs.length, 3);
assert.equal(categoryHubs.length, 4);
assert.deepEqual(allHubs, [...chargerHubs, ...categoryHubs]);
assert.deepEqual(
  allHubs.map((draft) => draft.id),
  [
    "art-en-hub-chargers",
    "art-es-hub-chargers",
    "art-pt-hub-chargers",
    "art-en-hub-usb-c-cables",
    "art-en-hub-power-banks",
    "art-en-hub-electric-screwdrivers",
    "art-en-hub-smart-home-sensors"
  ]
);

console.log("Sample base hub draft module tests passed");
