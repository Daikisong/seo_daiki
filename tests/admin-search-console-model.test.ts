import assert from "node:assert/strict";
import {
  formatSearchConsoleCtr,
  formatSearchConsolePosition,
  persistedLinkSummary,
  searchConsoleRowKey,
  searchConsoleSuggestionContext,
  searchConsoleSuggestionKey,
  sectionMatchLabel,
  topActions,
  topInternalLinkCandidates,
  topMissingSections
} from "../apps/web/lib/admin/admin-search-console-model";
import {
  formatSearchConsoleCtr as directFormatSearchConsoleCtr,
  formatSearchConsolePosition as directFormatSearchConsolePosition
} from "../apps/web/lib/admin/admin-search-console-formatters";
import {
  searchConsoleRowKey as directSearchConsoleRowKey,
  searchConsoleSuggestionKey as directSearchConsoleSuggestionKey
} from "../apps/web/lib/admin/admin-search-console-keys";
import {
  searchConsoleSuggestionContext as directSearchConsoleSuggestionContext,
  sectionMatchLabel as directSectionMatchLabel
} from "../apps/web/lib/admin/admin-search-console-suggestion-labels";
import {
  persistedLinkSummary as directPersistedLinkSummary,
  topActions as directTopActions,
  topInternalLinkCandidates as directTopInternalLinkCandidates,
  topMissingSections as directTopMissingSections
} from "../apps/web/lib/admin/admin-search-console-suggestion-lists";

assert.equal(searchConsoleRowKey, directSearchConsoleRowKey);
assert.equal(searchConsoleSuggestionKey, directSearchConsoleSuggestionKey);
assert.equal(formatSearchConsoleCtr, directFormatSearchConsoleCtr);
assert.equal(formatSearchConsolePosition, directFormatSearchConsolePosition);
assert.equal(searchConsoleSuggestionContext, directSearchConsoleSuggestionContext);
assert.equal(sectionMatchLabel, directSectionMatchLabel);
assert.equal(topInternalLinkCandidates, directTopInternalLinkCandidates);
assert.equal(topMissingSections, directTopMissingSections);
assert.equal(topActions, directTopActions);
assert.equal(persistedLinkSummary, directPersistedLinkSummary);

const row = {
  page: "/us/en/posts/magnesium-sleep/",
  query: "magnesium sleep",
  country: "US",
  device: "DESKTOP"
};

assert.equal(searchConsoleRowKey(row), "/us/en/posts/magnesium-sleep/-magnesium sleep-US-DESKTOP");
assert.equal(searchConsoleSuggestionKey({ page: row.page, query: row.query }), "/us/en/posts/magnesium-sleep/-magnesium sleep");
assert.equal(formatSearchConsoleCtr(0.03456), "3.46%");
assert.equal(formatSearchConsolePosition(7.189), "7.2");

assert.equal(
  searchConsoleSuggestionContext({ country: "US", device: "MOBILE", reason: "low_ctr" }),
  "US / MOBILE / low_ctr"
);
assert.equal(searchConsoleSuggestionContext({}), "-");
assert.equal(sectionMatchLabel({ section_match_score: 0.42 }), "section match 0.42");
assert.equal(sectionMatchLabel(undefined), undefined);

const links = [
  { path: "/a/", href: "/a/" },
  { path: "/b/", href: "/b/" },
  { path: "/c/", href: "/c/" },
  { path: "/d/", href: "/d/" }
];
assert.deepEqual(topInternalLinkCandidates(links).map((link) => link.path), ["/a/", "/b/", "/c/"]);
assert.equal(persistedLinkSummary(links), "Links: /a/, /b/, /c/");
assert.equal(persistedLinkSummary([]), undefined);

const sections = [
  { heading: "One" },
  { heading: "Two" },
  { heading: "Three" }
];
assert.deepEqual(topMissingSections(sections).map((section) => section.heading), ["One", "Two"]);
assert.deepEqual(topActions(["expand section", "rewrite title", "hold", "reject"]), [
  "expand section",
  "rewrite title",
  "hold"
]);

console.log("Admin Search Console model unit tests passed");
