import assert from "node:assert/strict";
import {
  adminRecordArchiveAuditData,
  adminRecordAuditLogData,
  adminRecordDeleteAuditData,
  articleStateGateBlockedAuditData,
  articleStateUpdatedAuditData
} from "../packages/db/src/adminMutationAuditPayloads";
import {
  articleStateGateBlockedAuditData as directArticleStateGateBlockedAuditData,
  articleStateUpdatedAuditData as directArticleStateUpdatedAuditData
} from "../packages/db/src/adminArticleStateAuditPayloads";
import {
  adminRecordArchiveAuditData as directAdminRecordArchiveAuditData,
  adminRecordAuditLogData as directAdminRecordAuditLogData,
  adminRecordDeleteAuditData as directAdminRecordDeleteAuditData
} from "../packages/db/src/adminRecordAuditPayloads";

assert.equal(articleStateGateBlockedAuditData, directArticleStateGateBlockedAuditData);
assert.equal(articleStateUpdatedAuditData, directArticleStateUpdatedAuditData);
assert.equal(adminRecordArchiveAuditData, directAdminRecordArchiveAuditData);
assert.equal(adminRecordDeleteAuditData, directAdminRecordDeleteAuditData);
assert.equal(adminRecordAuditLogData, directAdminRecordAuditLogData);

assert.equal(
  articleStateUpdatedAuditData({
    row: { id: "article-1" },
    before: { indexStatus: "pending" },
    after: { indexStatus: "index" }
  }).entityId,
  "article-1"
);
assert.equal(
  adminRecordDeleteAuditData({
    entityType: "product",
    entityId: "product-1",
    before: { id: "product-1" }
  }).summary,
  "Deleted product."
);

console.log("Admin mutation audit payload module tests passed");
