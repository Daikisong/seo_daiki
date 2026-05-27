import assert from "node:assert/strict";
import {
  average,
  complianceIssuesFromJson,
  normalizeActionList,
  normalizePersistedInternalLinks,
  normalizePersistedMissingSections,
  normalizeRefreshSuggestionPayload,
  numberFromUnknown,
  outlineHeadings,
  scoreBreakdownSummary,
  stringArrayFromUnknown,
  stringFromSearchParam,
  stringFromUnknown,
  summarizeJson
} from "../apps/web/lib/admin/admin-section-utils";
import { normalizeActionList as directNormalizeActionList } from "../apps/web/lib/admin/admin-refresh-action-list";
import { normalizePersistedInternalLinks as directNormalizePersistedInternalLinks } from "../apps/web/lib/admin/admin-refresh-internal-links";
import { normalizePersistedMissingSections as directNormalizePersistedMissingSections } from "../apps/web/lib/admin/admin-refresh-missing-sections";
import { normalizeRefreshSuggestionPayload as directNormalizeRefreshSuggestionPayload } from "../apps/web/lib/admin/admin-refresh-suggestion-payload-normalizer";

assert.equal(normalizeActionList, directNormalizeActionList);
assert.equal(normalizeRefreshSuggestionPayload, directNormalizeRefreshSuggestionPayload);
assert.equal(normalizePersistedMissingSections, directNormalizePersistedMissingSections);
assert.equal(normalizePersistedInternalLinks, directNormalizePersistedInternalLinks);
assert.deepEqual(normalizeActionList(["expand", 42]), ["expand", "42"]);
assert.deepEqual(normalizeActionList({ action: "expand" }), ['{"action":"expand"}']);
assert.deepEqual(normalizeActionList("hold"), ["hold"]);

const payload = normalizeRefreshSuggestionPayload({
  action: ["expand_section"],
  priority: "7",
  title_candidate: "Better title",
  meta_description_candidate: "Better meta description",
  missing_sections: [
    "Plain heading",
    {
      heading: "Comparison details",
      why: "Users compare options",
      intent: "commercial",
      recommended_details: ["price", "risk"]
    },
    { why: "missing heading" }
  ],
  internal_link_candidates: [
    {
      href: "/us/en/posts/magnesium-sleep/",
      anchor: "magnesium sleep",
      score: "8",
      score_breakdown: { topical: "4", market: 3 }
    },
    { reason: "missing path" }
  ]
});

assert.equal(payload.priority, 7);
assert.equal(payload.titleCandidate, "Better title");
assert.equal(payload.metaDescriptionCandidate, "Better meta description");
assert.deepEqual(payload.actions, ["expand_section"]);
assert.deepEqual(payload.missingSections.map((section) => section.heading), ["Plain heading", "Comparison details"]);
assert.equal(payload.missingSections[1]?.recommended_details?.join(","), "price,risk");
assert.equal(payload.internalLinkCandidates.length, 1);
assert.equal(payload.internalLinkCandidates[0]?.path, "/us/en/posts/magnesium-sleep/");
assert.equal(payload.internalLinkCandidates[0]?.score, 8);
assert.equal(payload.internalLinkCandidates[0]?.score_breakdown?.topical, 4);

const camelPayload = normalizeRefreshSuggestionPayload({
  actions: "rewrite_title",
  titleCandidate: "Camel title",
  metaDescriptionCandidate: "Camel meta",
  missingSections: [{ heading: "Freshness" }],
  internalLinkCandidates: [{ path: "/global/topics/", score: 5 }]
});
assert.equal(camelPayload.titleCandidate, "Camel title");
assert.deepEqual(camelPayload.actions, ["rewrite_title"]);
assert.equal(camelPayload.internalLinkCandidates[0]?.href, "/global/topics/");

assert.equal(average([]), 0);
assert.equal(average([2, 4, 6]), 4);
assert.equal(scoreBreakdownSummary({ growthScore: 81, evidenceScore: 64, affiliateFit: 33 }), "growth 81, evidence 64, affiliateFit 33");
assert.equal(stringFromSearchParam(["es", "en"]), "es");
assert.equal(stringFromSearchParam(undefined), "");
assert.deepEqual(outlineHeadings(["Intro", { heading: "Evidence" }, { title: "Ignored" }]), ["Intro", "Evidence"]);
assert.deepEqual(complianceIssuesFromJson({ healthBlockers: ["health_claim"] }), ["health_claim"]);
assert.equal(summarizeJson(["a", "b"]), "2 items");
assert.equal(summarizeJson({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }), "one, two, three, four, five");
assert.equal(stringFromUnknown(null), "");
assert.deepEqual(stringArrayFromUnknown(["a", 2, "b"]), ["a", "b"]);
assert.equal(numberFromUnknown("12.5"), 12.5);
assert.equal(numberFromUnknown("bad"), 0);

console.log("Admin section utility unit tests passed");
