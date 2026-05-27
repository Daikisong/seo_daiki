import assert from "node:assert/strict";
import {
  matchesTrendFilters,
  normalizeContentBriefExportRows,
  normalizeLocalizationExportRows,
  normalizePublishingGateComplianceRows,
  normalizePublishingGateRows,
  normalizeTopicScoreRows,
  normalizeTrendSignalRows
} from "../apps/web/lib/admin/admin-trend-workflow-normalizers";
import { normalizeLocalizationExportRows as splitLocalizationRows } from "../apps/web/lib/admin/admin-localization-normalizers";
import {
  normalizePublishingGateComplianceRows as splitPublishingComplianceRows,
  normalizePublishingGateRows as splitPublishingGateRows
} from "../apps/web/lib/admin/admin-publishing-normalizers";
import {
  normalizeContentBriefExportRows as splitContentBriefRows,
  normalizeTopicScoreRows as splitTopicRows
} from "../apps/web/lib/admin/admin-topic-brief-normalizers";
import {
  matchesTrendFilters as splitMatchesTrendFilters,
  normalizeTrendSignalRows as splitTrendSignalRows
} from "../apps/web/lib/admin/admin-trend-signal-normalizers";

assert.equal(normalizeTrendSignalRows, splitTrendSignalRows);
assert.equal(matchesTrendFilters, splitMatchesTrendFilters);
assert.equal(normalizeTopicScoreRows, splitTopicRows);
assert.equal(normalizeContentBriefExportRows, splitContentBriefRows);
assert.equal(normalizePublishingGateRows, splitPublishingGateRows);
assert.equal(normalizePublishingGateComplianceRows, splitPublishingComplianceRows);
assert.equal(normalizeLocalizationExportRows, splitLocalizationRows);

assert.equal(matchesTrendFilters({ locale: "en", country: "US", sourceName: "Manual CSV" }, { country: "US", source: "manual" }), true);
assert.equal(normalizeTrendSignalRows([{ id: "t1", locale: "en", country: "US", query: "charger", sourceId: "manual_csv" }], { locale: "es" }).length, 0);

const topic = normalizeTopicScoreRows([{ id: "topic-1", score: "82", scoreBreakdown: { growthScore: "50" } }])[0];
assert.equal(topic?.primaryLocale, "en");
assert.equal(topic?.scoreBreakdown.growthScore, 50);

const brief = normalizeContentBriefExportRows([{ id: "brief-1", topicId: "topic-1", outlineJson: [{ heading: "Intro" }] }])[0];
assert.deepEqual(brief?.outline, ["Intro"]);

assert.equal(normalizePublishingGateRows([{ articleId: "article-1", blockers: [] }])[0]?.outputSummary, "ready for manual review");
assert.equal(normalizePublishingGateComplianceRows([{ articleId: "article-1", blockers: ["missing_evidence"] }]).length, 1);
assert.equal(normalizeLocalizationExportRows([{ id: "loc-1", locale: "es", localizationDepthScore: "81" }])[0]?.variants[0]?.localizationDepthScore, 81);

console.log("Admin trend workflow normalizer module tests passed");
