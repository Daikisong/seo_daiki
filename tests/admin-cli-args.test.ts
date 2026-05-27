import assert from "node:assert/strict";
import {
  availableCommandsText,
  indexStatusUsage,
  parseAdminCliArgs,
  recordActionUsage,
  refreshSuggestionListUsage,
  refreshSuggestionStatusUsage
} from "../packages/db/src/adminCliArgs";

assert.deepEqual(parseAdminCliArgs(["--", "list-articles"]), { command: "list-articles", args: [] });
assert.deepEqual(parseAdminCliArgs(["set-index-status", "article-1", "index"]), {
  command: "set-index-status",
  args: ["article-1", "index"]
});

assert.match(indexStatusUsage(), /set-index-status <articleId>/);
assert.match(refreshSuggestionListUsage(["open", "planned"]), /open\|planned/);
assert.match(refreshSuggestionStatusUsage(["applied", "dismissed"]), /applied\|dismissed/);
assert.match(recordActionUsage("archive-record"), /archive-record <product/);
assert.match(availableCommandsText(), /import-search-console/);

console.log("Admin CLI argument helper tests passed");
