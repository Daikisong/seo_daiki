import assert from "node:assert/strict";
import { PersistedRefreshWorkflowTable } from "../apps/web/app/admin/[section]/PersistedRefreshWorkflowTable";
import { SearchConsoleSection } from "../apps/web/app/admin/[section]/SearchConsoleSection";
import { SearchPerformanceRowsTable } from "../apps/web/app/admin/[section]/SearchPerformanceRowsTable";
import { SearchRefreshSuggestionsTable } from "../apps/web/app/admin/[section]/SearchRefreshSuggestionsTable";

assert.equal(typeof SearchConsoleSection, "function");
assert.equal(typeof SearchPerformanceRowsTable, "function");
assert.equal(typeof SearchRefreshSuggestionsTable, "function");
assert.equal(typeof PersistedRefreshWorkflowTable, "function");

console.log("Admin Search Console section module export tests passed");
