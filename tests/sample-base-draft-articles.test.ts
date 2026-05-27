import assert from "node:assert/strict";
import { buildBaseDraftArticles } from "../packages/content/src/sample-base-draft-articles";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const drafts = buildBaseDraftArticles({
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

assert.equal(drafts.length, 29);
assert.equal(new Set(drafts.map((draft) => draft.id)).size, drafts.length);

const chargerHubs = drafts.filter((draft) => draft.group === "hub-usb-c-chargers");
assert.deepEqual(
  chargerHubs.map((draft) => `${draft.locale}:${draft.slug}`),
  ["en:usb-c-chargers", "es:cargadores-usb-c", "pt-br:carregadores-usb-c"]
);

const pendingHub = drafts.find((draft) => draft.id === "art-en-hub-electric-screwdrivers");
assert.equal(pendingHub?.indexStatus, "pending");
assert.equal(pendingHub?.publishStatus, "published");

const pendingReview = drafts.find((draft) => draft.id === "art-en-review-ugreen-pending");
assert.equal(pendingReview?.publishStatus, "draft");
assert.equal(pendingReview?.indexStatus, "pending");
assert.equal(pendingReview?.internalLinks.length, 3);

for (const draft of drafts) {
  assert.equal(draft.lastUpdated, "2026-05-25", `${draft.id} should inherit the shared update date`);
  assert.ok(draft.sections.length >= 1, `${draft.id} should keep generated sections`);
}

console.log("Sample base draft article unit tests passed");
