import assert from "node:assert/strict";
import type { ValidationIssue } from "@global-import-lab/validators";
import {
  adminEntityTypes,
  adminRecordActions,
  archiveMutationData,
  archiveSummary,
  collectArticleStateGateBlockers,
  deleteSummary,
  indexStatuses,
  isAdminEntityType,
  isAdminRecordAction,
  isIndexStatus,
  isPublishStatus,
  normalizeArticleStateInput,
  publishStatuses,
  relatedArticleArchiveData,
  shouldArchiveRelatedArticles,
  toJson
} from "../packages/db/src/adminMutationRules";

assert.deepEqual(indexStatuses, ["index", "noindex", "pending", "refresh_needed", "merge_candidate"]);
assert.deepEqual(publishStatuses, ["draft", "pending", "published"]);
assert.deepEqual(adminEntityTypes, ["product", "variant", "seller-claim", "verified-claim", "market-risk", "evidence-pack", "article"]);
assert.deepEqual(adminRecordActions, ["archive", "delete"]);

assert.equal(isIndexStatus("index"), true);
assert.equal(isIndexStatus("refresh_needed"), true);
assert.equal(isIndexStatus("published"), false);
assert.equal(isPublishStatus("published"), true);
assert.equal(isPublishStatus("merge_candidate"), false);
assert.equal(isAdminEntityType("seller-claim"), true);
assert.equal(isAdminEntityType("seller_claim"), false);
assert.equal(isAdminRecordAction("archive"), true);
assert.equal(isAdminRecordAction("restore"), false);

assert.deepEqual(
  normalizeArticleStateInput({
    id: "article-a",
    indexStatus: "index",
    publishStatus: "draft",
    qualityScore: 91
  }),
  {
    id: "article-a",
    indexStatus: "noindex",
    publishStatus: "draft",
    qualityScore: 91
  }
);
assert.deepEqual(
  normalizeArticleStateInput({
    id: "article-b",
    indexStatus: "index",
    publishStatus: "published"
  }),
  {
    id: "article-b",
    indexStatus: "index",
    publishStatus: "published"
  }
);
assert.deepEqual(normalizeArticleStateInput({ id: "article-c", publishStatus: "pending" }), {
  id: "article-c",
  publishStatus: "pending"
});

const warning: ValidationIssue = {
  code: "minor_issue",
  message: "A non-blocking warning.",
  severity: "warning"
};
const existingBlocker: ValidationIssue = {
  code: "existing_blocker",
  message: "Existing quality gate blocker.",
  severity: "blocker"
};

assert.deepEqual(
  collectArticleStateGateBlockers(
    { indexStatus: "index", publishStatus: "published", qualityScore: 80 },
    { indexStatus: "index", issues: [warning] }
  ),
  []
);

const stateBlockers = collectArticleStateGateBlockers(
  { indexStatus: "index", publishStatus: "draft", qualityScore: 79 },
  { indexStatus: "noindex", issues: [warning, existingBlocker] }
);
assert.deepEqual(stateBlockers.map((issue) => issue.code), [
  "existing_blocker",
  "publish_state_not_published",
  "quality_score_below_index_threshold",
  "quality_gate_not_index"
]);
assert.equal(stateBlockers.every((issue) => issue.severity === "blocker"), true);

assert.equal(archiveSummary("product"), "Archived product and marked related articles noindex/draft.");
assert.equal(archiveSummary("article"), "Archived article and marked it noindex/draft.");
assert.equal(archiveSummary("variant"), "Archived variant.");

const archivedAt = new Date("2026-05-27T00:00:00.000Z");
assert.deepEqual(archiveMutationData("variant", archivedAt), { archivedAt });
assert.deepEqual(archiveMutationData("article", archivedAt), {
  archivedAt,
  indexStatus: "noindex",
  publishStatus: "draft"
});
assert.equal(shouldArchiveRelatedArticles("product"), true);
assert.equal(shouldArchiveRelatedArticles("article"), false);
assert.deepEqual(relatedArticleArchiveData(archivedAt), {
  archivedAt,
  indexStatus: "noindex",
  publishStatus: "draft"
});
assert.equal(deleteSummary("market-risk"), "Deleted market-risk.");

assert.deepEqual(toJson({ keep: "value", drop: undefined, nested: { count: 2 } }), {
  keep: "value",
  nested: { count: 2 }
});

console.log("Admin mutation rule unit tests passed");
