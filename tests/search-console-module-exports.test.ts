import assert from "node:assert/strict";
import {
  createRefreshSuggestion,
  importSearchConsoleMetrics,
  isRefreshSuggestionStatus,
  listRefreshSuggestions,
  refreshSuggestionStatuses,
  updateRefreshSuggestionStatus
} from "../packages/db/src/searchConsole";
import { importSearchConsoleMetrics as directImportSearchConsoleMetrics } from "../packages/db/src/searchConsoleMetrics";
import {
  createRefreshSuggestion as directCreateRefreshSuggestion,
  listRefreshSuggestions as directListRefreshSuggestions,
  updateRefreshSuggestionStatus as directUpdateRefreshSuggestionStatus
} from "../packages/db/src/searchConsoleRefreshSuggestions";
import {
  isRefreshSuggestionStatus as directIsRefreshSuggestionStatus,
  refreshSuggestionStatuses as directRefreshSuggestionStatuses
} from "../packages/db/src/searchConsoleTypes";

assert.equal(importSearchConsoleMetrics, directImportSearchConsoleMetrics);
assert.equal(createRefreshSuggestion, directCreateRefreshSuggestion);
assert.equal(listRefreshSuggestions, directListRefreshSuggestions);
assert.equal(updateRefreshSuggestionStatus, directUpdateRefreshSuggestionStatus);
assert.equal(isRefreshSuggestionStatus, directIsRefreshSuggestionStatus);
assert.equal(refreshSuggestionStatuses, directRefreshSuggestionStatuses);

assert.deepEqual(refreshSuggestionStatuses, ["open", "planned", "applied", "dismissed"]);
assert.equal(isRefreshSuggestionStatus("open"), true);
assert.equal(isRefreshSuggestionStatus("invalid"), false);

console.log("Search Console DB module export tests passed");
