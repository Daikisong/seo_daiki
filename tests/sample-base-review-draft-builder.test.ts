import assert from "node:assert/strict";
import { buildBaseReviewDraft } from "../packages/content/src/sample-base-review-drafts";
import { sampleInternalLinks, sampleSections } from "../packages/content/src/sample-article-helpers";

const draft = buildBaseReviewDraft(
  {
    updatedAt: "2026-05-25",
    internalLinks: sampleInternalLinks,
    sections: sampleSections
  },
  {
    group: "review-custom",
    id: "art-custom-review",
    productId: "prod-custom",
    locale: "es",
    slug: "custom-review",
    type: "review",
    title: "Custom review",
    h1: "Custom review H1",
    metaDescription: "Custom review meta",
    summary: "Custom review summary",
    contentMdx: "review evidence",
    sectionHeadings: ["Uno", "Dos"],
    evidenceIds: ["ev-a", "ev-b"],
    qualityScore: 88,
    affiliateLabel: "Ver oferta",
    affiliateHref: "https://example.com/go/custom"
  }
);

assert.equal(draft.group, "review-custom");
assert.equal(draft.productId, "prod-custom");
assert.equal(draft.locale, "es");
assert.equal(draft.type, "review");
assert.equal(draft.indexStatus, "index");
assert.equal(draft.publishStatus, "published");
assert.equal(draft.qualityScore, 88);
assert.equal(draft.lastUpdated, "2026-05-25");
assert.deepEqual(draft.sections.map((section) => section.heading), ["Uno", "Dos"]);
assert.deepEqual(draft.affiliateLinks, [
  {
    label: "Ver oferta",
    href: "https://example.com/go/custom",
    rel: "sponsored nofollow"
  }
]);

console.log("Sample base review draft builder tests passed");
