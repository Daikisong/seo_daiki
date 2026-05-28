import assert from "node:assert/strict";
import { buildHubDraft, englishCategoryHubDraft } from "../packages/content/src/sample-base-hub-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const context = {
  updatedAt: "2026-05-25",
  internalLinks: sampleInternalLinks,
  sections: sampleSections
};

const customHub = buildHubDraft(context, {
  group: "hub-custom",
  id: "art-custom-hub",
  locale: "es",
  slug: "custom-hub",
  type: "hub",
  title: "Custom Hub",
  metaDescription: "Custom hub meta",
  summary: "Custom hub summary",
  contentMdx: "hub content",
  sectionHeadings: ["Uno", "Dos"],
  evidenceIds: ["ev-a", "ev-b"]
});

assert.equal(customHub.h1, "Custom Hub");
assert.equal(customHub.qualityScore, 84);
assert.equal(customHub.indexStatus, "index");
assert.equal(customHub.publishStatus, "published");
assert.equal(customHub.lastUpdated, "2026-05-25");
assert.equal(customHub.internalLinks[0]?.href.startsWith("/es/"), true);
assert.deepEqual(customHub.sections.map((section) => section.heading), ["Uno", "Dos"]);

const pendingEnglishCategoryHub = englishCategoryHubDraft(context, {
  id: "art-custom-category-hub",
  slug: "custom-category",
  title: "Custom Category Hub",
  summary: "Custom category summary",
  evidenceIds: ["ev-c"],
  indexStatus: "pending",
  qualityScore: 72
});

assert.equal(pendingEnglishCategoryHub.group, "hub-custom-category");
assert.equal(pendingEnglishCategoryHub.locale, "en");
assert.equal(pendingEnglishCategoryHub.indexStatus, "pending");
assert.equal(pendingEnglishCategoryHub.qualityScore, 72);
assert.equal(
  pendingEnglishCategoryHub.metaDescription,
  "Custom Category Hub with seller claims, verified evidence, variant traps, price truth, and import risk notes."
);
assert.equal(pendingEnglishCategoryHub.affiliateLinks.length, 0);

console.log("Sample base hub draft builder tests passed");
