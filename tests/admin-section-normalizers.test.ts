import assert from "node:assert/strict";
import {
  duplicateCandidateCountsFromRows,
  matchesTrendFilters,
  normalizeAffiliatePlacementCandidateRows,
  normalizeContentBriefExportRows,
  normalizeLocalizationExportRows,
  normalizePersistedRefreshSuggestion,
  normalizePublishingGateComplianceRows,
  normalizePublishingGateRows,
  normalizeTopicScoreRows,
  normalizeTrendSignalRows
} from "../apps/web/lib/admin/admin-section-normalizers";

const persisted = normalizePersistedRefreshSuggestion({
  id: "refresh-1",
  page: "/us/en/posts/magnesium-sleep/",
  query: "magnesium sleep",
  reason: "low ctr",
  actions: {
    action: ["rewrite_title"],
    priority: "8",
    title_candidate: "Better magnesium sleep title",
    missing_sections: [{ heading: "Dose caveats" }],
    internal_link_candidates: [{ path: "/global/topics/", score: "5" }]
  },
  status: "open",
  createdAt: new Date("2026-05-27T00:00:00.000Z"),
  updatedAt: new Date("2026-05-27T01:00:00.000Z")
});

assert.equal(persisted.priority, 8);
assert.deepEqual(persisted.actions, ["rewrite_title"]);
assert.equal(persisted.createdAt, "2026-05-27T00:00:00.000Z");
assert.equal(persisted.missingSections[0]?.heading, "Dose caveats");
assert.equal(persisted.internalLinkCandidates[0]?.path, "/global/topics/");

assert.deepEqual(
  duplicateCandidateCountsFromRows([
    {
      canonical_product: { product_id: "prod-a" },
      source_product_ids: ["prod-b", ""],
      duplicate_candidates: [
        { decision: "keep_separate", confidence: 0.2 },
        { decision: "merge", confidence: 0.1 },
        { decision: "keep_separate", confidence: 0.7 }
      ]
    }
  ]),
  { "prod-a": 2, "prod-b": 2 }
);

const trendRows = normalizeTrendSignalRows(
  [
    { id: "trend-1", locale: "en", country: "US", query: "magnesium", growthScore: "70", sourceId: "manual_csv" },
    { id: "trend-2", locale: "es", country: "ES", query: "usb c", sourceId: "news" }
  ],
  { locale: "en", source: "manual" }
);
assert.equal(trendRows.length, 1);
assert.equal(trendRows[0]?.growthScore, 70);
assert.equal(matchesTrendFilters({ locale: "en", country: "US", sourceName: "Manual CSV" }, { source: "manual" }), true);

const topics = normalizeTopicScoreRows([
  { id: "topic-1", canonicalTopic: "USB C Charger", score: "81", scoreBreakdown: { growthScore: "50" }, signalCount: "3" }
]);
assert.equal(topics[0]?.primaryLocale, "en");
assert.equal(topics[0]?.scoreBreakdown.growthScore, 50);

const briefs = normalizeContentBriefExportRows([
  {
    id: "brief-1",
    topicId: "topic-1",
    locale: "en",
    articleType: "trend",
    titleCandidate: "Title",
    outlineJson: [{ heading: "Intro" }],
    requiredEvidence: ["source"]
  }
]);
assert.deepEqual(briefs[0]?.outline, ["Intro"]);
assert.deepEqual(briefs[0]?.requiredEvidence, ["source"]);

const publishingRows = normalizePublishingGateRows([
  { articleId: "article-1", locale: "en", status: "blocked", blockers: ["missing_evidence"] },
  { articleId: "article-2", locale: "en", status: "ready", blockers: [] }
]);
assert.equal(publishingRows[0]?.outputSummary, "missing_evidence");
assert.equal(publishingRows[1]?.outputSummary, "ready for manual review");

const complianceRows = normalizePublishingGateComplianceRows([
  { articleId: "article-1", locale: "en", type: "trend", status: "blocked", blockers: ["missing_evidence"] },
  { articleId: "article-2", locale: "en", status: "ready", blockers: [] }
]);
assert.equal(complianceRows.length, 1);
assert.deepEqual(complianceRows[0]?.issues, ["missing_evidence"]);

const localizedRows = normalizeLocalizationExportRows([
  { id: "localized-1", sourceArticleId: "source-1", topicId: "topic-1", locale: "es", translationStatus: "localized", localizationDepthScore: "82" }
]);
assert.equal(localizedRows[0]?.id, "source-1");
assert.equal(localizedRows[0]?.variants[0]?.localizationDepthScore, 82);

const candidates = normalizeAffiliatePlacementCandidateRows([
  {
    id: "candidate-1",
    topicId: "topic-1",
    merchantSlug: "merchant",
    anchorText: "charger",
    disclosureShown: true,
    humanApprovalRequired: false,
    offerScore: "73",
    scoreBreakdown: { topical: "40" }
  },
  { topicId: "missing-id" }
]);
assert.equal(candidates.length, 1);
assert.equal(candidates[0]?.humanApprovalRequired, false);
assert.equal(candidates[0]?.scoreBreakdown.topical, 40);

console.log("Admin section normalizer unit tests passed");
