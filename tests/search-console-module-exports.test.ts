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
  toRefreshSuggestionJson,
  listRefreshSuggestions as directListRefreshSuggestions,
  updateRefreshSuggestionStatus as directUpdateRefreshSuggestionStatus
} from "../packages/db/src/searchConsoleRefreshSuggestions";
import { createRefreshSuggestion as splitCreateRefreshSuggestion } from "../packages/db/src/searchConsoleRefreshSuggestionCreate";
import { toRefreshSuggestionJson as splitToRefreshSuggestionJson } from "../packages/db/src/searchConsoleRefreshSuggestionJson";
import { listRefreshSuggestions as splitListRefreshSuggestions } from "../packages/db/src/searchConsoleRefreshSuggestionQueries";
import { updateRefreshSuggestionStatus as splitUpdateRefreshSuggestionStatus } from "../packages/db/src/searchConsoleRefreshSuggestionStatus";
import {
  isRefreshSuggestionStatus as directIsRefreshSuggestionStatus,
  refreshSuggestionStatuses as directRefreshSuggestionStatuses
} from "../packages/db/src/searchConsoleTypes";

assert.equal(importSearchConsoleMetrics, directImportSearchConsoleMetrics);
assert.equal(createRefreshSuggestion, directCreateRefreshSuggestion);
assert.equal(listRefreshSuggestions, directListRefreshSuggestions);
assert.equal(updateRefreshSuggestionStatus, directUpdateRefreshSuggestionStatus);
assert.equal(directCreateRefreshSuggestion, splitCreateRefreshSuggestion);
assert.equal(directListRefreshSuggestions, splitListRefreshSuggestions);
assert.equal(directUpdateRefreshSuggestionStatus, splitUpdateRefreshSuggestionStatus);
assert.equal(toRefreshSuggestionJson, splitToRefreshSuggestionJson);
assert.equal(isRefreshSuggestionStatus, directIsRefreshSuggestionStatus);
assert.equal(refreshSuggestionStatuses, directRefreshSuggestionStatuses);

assert.deepEqual(refreshSuggestionStatuses, ["open", "planned", "applied", "dismissed"]);
assert.equal(isRefreshSuggestionStatus("open"), true);
assert.equal(isRefreshSuggestionStatus("invalid"), false);
assert.deepEqual(toRefreshSuggestionJson({ nested: { count: 2 } }), { nested: { count: 2 } });

console.log("Search Console DB module export tests passed");
