import assert from "node:assert/strict";
import { buildBaseHubDrafts } from "../packages/content/src/sample-base-hub-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const hubDrafts = buildBaseHubDrafts({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(hubDrafts.length, 7);
assert.deepEqual(
  hubDrafts.map((draft) => draft.id),
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

const localizedChargerHubs = hubDrafts.filter((draft) => draft.group === "hub-usb-c-chargers");
assert.deepEqual(
  localizedChargerHubs.map((draft) => `${draft.locale}:${draft.slug}`),
  ["en:usb-c-chargers", "es:cargadores-usb-c", "pt-br:carregadores-usb-c"]
);

const pendingHubs = hubDrafts.filter((draft) => draft.indexStatus === "pending");
assert.deepEqual(
  pendingHubs.map((draft) => draft.id),
  ["art-en-hub-electric-screwdrivers", "art-en-hub-smart-home-sensors"]
);

for (const draft of hubDrafts) {
  assert.equal(draft.type, "hub");
  assert.equal(draft.lastUpdated, "2026-05-25");
  assert.ok(draft.sections.length >= 1, `${draft.id} should keep generated sections`);
}

console.log("Sample base hub draft module tests passed");
