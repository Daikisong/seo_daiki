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
import { normalizeAffiliatePlacementCandidateRows as directAffiliateCandidates } from "../apps/web/lib/admin/admin-affiliate-normalizers";
import { duplicateCandidateCountsFromRows as directDuplicateCounts } from "../apps/web/lib/admin/admin-duplicate-normalizers";
import { normalizePersistedRefreshSuggestion as directRefreshSuggestion } from "../apps/web/lib/admin/admin-refresh-normalizers";
import {
  matchesTrendFilters as directMatchesTrendFilters,
  normalizeContentBriefExportRows as directContentBriefRows,
  normalizeLocalizationExportRows as directLocalizationRows,
  normalizePublishingGateComplianceRows as directPublishingComplianceRows,
  normalizePublishingGateRows as directPublishingGateRows,
  normalizeTopicScoreRows as directTopicRows,
  normalizeTrendSignalRows as directTrendRows
} from "../apps/web/lib/admin/admin-trend-workflow-normalizers";

assert.equal(normalizePersistedRefreshSuggestion, directRefreshSuggestion);
assert.equal(duplicateCandidateCountsFromRows, directDuplicateCounts);
assert.equal(normalizeTrendSignalRows, directTrendRows);
assert.equal(matchesTrendFilters, directMatchesTrendFilters);
assert.equal(normalizeTopicScoreRows, directTopicRows);
assert.equal(normalizeContentBriefExportRows, directContentBriefRows);
assert.equal(normalizePublishingGateRows, directPublishingGateRows);
assert.equal(normalizePublishingGateComplianceRows, directPublishingComplianceRows);
assert.equal(normalizeLocalizationExportRows, directLocalizationRows);
assert.equal(normalizeAffiliatePlacementCandidateRows, directAffiliateCandidates);

console.log("Admin normalizer module export tests passed");
