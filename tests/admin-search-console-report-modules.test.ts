import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  normalizeInternalLink,
  normalizeMissingSection,
  normalizeRow,
  normalizeScoreBreakdown,
  normalizeSuggestion,
  numberValue,
  readFirstJson,
  searchConsoleRowPaths,
  searchConsoleSuggestionPaths
} from "../apps/web/lib/admin/search-console-report";
import { normalizeRow as splitNormalizeRow } from "../apps/web/lib/admin/search-console-report-normalizers";

assert.equal(normalizeRow, splitNormalizeRow);
assert.equal(numberValue("12.5"), 12.5);
assert.equal(numberValue("bad"), 0);

assert.deepEqual(
  normalizeRow({
    page: "/us/en/posts/magnesium-sleep/",
    query: "magnesium sleep",
    clicks: "4" as unknown as number,
    impressions: "200" as unknown as number,
    ctr: "0.02" as unknown as number,
    position: "9.4" as unknown as number
  }),
  {
    page: "/us/en/posts/magnesium-sleep/",
    query: "magnesium sleep",
    country: undefined,
    device: undefined,
    clicks: 4,
    impressions: 200,
    ctr: 0.02,
    position: 9.4
  }
);

assert.deepEqual(normalizeMissingSection("Evidence gap"), { heading: "Evidence gap" });
assert.deepEqual(normalizeInternalLink({ href: "/en/data/charger/", score: "12", score_breakdown: { match: "8" } }), {
  path: "/en/data/charger/",
  href: "/en/data/charger/",
  type: undefined,
  anchor: undefined,
  reason: undefined,
  score: 12,
  score_breakdown: { match: 8 }
});
assert.deepEqual(normalizeScoreBreakdown("bad"), undefined);

const suggestion = normalizeSuggestion({
  page: "/us/en/posts/magnesium-sleep/",
  action: ["rewrite", 7] as unknown as string[],
  missing_sections: ["Evidence gap", { heading: "" }],
  internal_link_candidates: [{ href: "/en/data/charger/" }, {}]
});
assert.deepEqual(suggestion.action, ["rewrite", "7"]);
assert.deepEqual(suggestion.missing_sections?.map((section) => section.heading), ["Evidence gap"]);
assert.deepEqual(suggestion.internal_link_candidates?.map((link) => link.path), ["/en/data/charger/"]);

const root = mkdtempSync(join(tmpdir(), "seo-daiki-search-console-report-"));
try {
  mkdirSync(join(root, "data/snapshots"), { recursive: true });
  mkdirSync(join(root, "data/exports"), { recursive: true });
  writeFileSync(join(root, "data/snapshots/search_console_sample.json"), JSON.stringify([{ query: "sample" }]));

  assert.deepEqual(searchConsoleRowPaths(root), [
    join(root, "data/snapshots/search_console_rows.json"),
    join(root, "data/snapshots/search_console_sample.json")
  ]);
  assert.deepEqual(searchConsoleSuggestionPaths(root), [join(root, "data/exports/search_console_suggestions.json")]);
} finally {
  rmSync(root, { recursive: true, force: true });
}

runFileAssertions().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function runFileAssertions() {
  const asyncRoot = mkdtempSync(join(tmpdir(), "seo-daiki-search-console-report-async-"));
  try {
    mkdirSync(join(asyncRoot, "data/snapshots"), { recursive: true });
    writeFileSync(join(asyncRoot, "data/snapshots/search_console_sample.json"), JSON.stringify([{ query: "sample" }]));

    assert.deepEqual(await readFirstJson(searchConsoleRowPaths(asyncRoot)), [{ query: "sample" }]);
    assert.deepEqual(await readFirstJson([join(asyncRoot, "missing.json")]), []);
  } finally {
    rmSync(asyncRoot, { recursive: true, force: true });
  }

  console.log("Admin Search Console report module tests passed");
}
