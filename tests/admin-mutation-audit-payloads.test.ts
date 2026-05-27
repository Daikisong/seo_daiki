import assert from "node:assert/strict";
import type { ValidationIssue } from "@global-import-lab/validators";
import {
  adminRecordArchiveAuditData,
  adminRecordAuditLogData,
  adminRecordDeleteAuditData,
  articleStateGateBlockedAuditData,
  articleStateUpdatedAuditData
} from "../packages/db/src/adminMutationAuditPayloads";

const blocker: ValidationIssue = {
  code: "missing_evidence",
  message: "Evidence is required.",
  severity: "blocker"
};

const blocked = articleStateGateBlockedAuditData({
  effective: { id: "article-1", indexStatus: "index", publishStatus: "published" },
  requested: { id: "article-1", indexStatus: "index", publishStatus: "published", ignored: undefined },
  before: { id: "article-1", publishStatus: "draft" },
  gateStatus: "blocked",
  gateScore: 62,
  issues: [blocker]
});

assert.equal(blocked.entityType, "article");
assert.equal(blocked.entityId, "article-1");
assert.equal(blocked.action, "publish_gate_blocked");
assert.equal((blocked.afterJson as any).requested.ignored, undefined);
assert.equal((blocked.afterJson as any).gateScore, 62);
assert.deepEqual((blocked.afterJson as any).issues, [blocker]);

const updated = articleStateUpdatedAuditData({
  row: { id: "article-2" },
  before: { id: "article-2", indexStatus: "pending" },
  after: { id: "article-2", indexStatus: "index" }
});

assert.equal(updated.action, "update");
assert.equal(updated.summary, "Updated article index/publish state after publishing gate validation.");
assert.deepEqual(updated.beforeJson, { id: "article-2", indexStatus: "pending" });
assert.deepEqual(updated.afterJson, { id: "article-2", indexStatus: "index" });

const archived = adminRecordArchiveAuditData({
  entityType: "product",
  entityId: "product-1",
  actor: "tester",
  before: { id: "product-1" },
  after: { id: "product-1", archivedAt: "now" }
});

assert.equal(archived.summary, "Archived product and marked related articles noindex/draft.");
assert.equal(archived.actor, "tester");

const deleted = adminRecordDeleteAuditData({
  entityType: "market-risk",
  entityId: "risk-1",
  before: { id: "risk-1" }
});

assert.equal(deleted.action, "delete");
assert.equal(deleted.summary, "Deleted market-risk.");

const generic = adminRecordAuditLogData({
  entityType: "article",
  entityId: "article-3",
  action: "custom",
  beforeJson: { keep: "yes", drop: undefined },
  afterJson: undefined
});

assert.deepEqual(generic.beforeJson, { keep: "yes" });
assert.equal(generic.afterJson, undefined);

console.log("Admin mutation audit payload unit tests passed");
