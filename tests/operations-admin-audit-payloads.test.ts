import assert from "node:assert/strict";
import {
  contentBriefStatusUpdatedAuditData,
  merchantUpsertAuditData,
  offerUpsertAuditData,
  publishingJobCreatedAuditData,
  publishingJobRetryAuditData,
  topicStatusUpdatedAuditData
} from "../packages/db/src/operationsAdminAuditPayloads";

const createdJob = publishingJobCreatedAuditData({
  row: { id: "job-1" },
  jobType: "generate_content_brief"
});

assert.equal(createdJob.entityType, "publishing-job");
assert.equal(createdJob.entityId, "job-1");
assert.equal(createdJob.actor, "admin");
assert.equal(createdJob.summary, "Queued publishing job generate_content_brief.");
assert.deepEqual(createdJob.afterJson, { id: "job-1" });

const topicStatus = topicStatusUpdatedAuditData({
  id: "topic-1",
  status: "briefed",
  actor: "editor",
  before: { status: "candidate" },
  after: { status: "briefed" }
});

assert.equal(topicStatus.summary, "Marked topic as briefed.");
assert.equal(topicStatus.actor, "editor");
assert.deepEqual(topicStatus.beforeJson, { status: "candidate" });
assert.deepEqual(topicStatus.afterJson, { status: "briefed" });

const briefStatus = contentBriefStatusUpdatedAuditData({
  id: "brief-1",
  status: "approved",
  before: { status: "draft" },
  after: { status: "approved" }
});

assert.equal(briefStatus.entityType, "content-brief");
assert.equal(briefStatus.summary, "Marked content brief as approved.");

const retry = publishingJobRetryAuditData({
  id: "job-2",
  before: { status: "failed", error: "timeout" },
  after: { status: "queued", error: null }
});

assert.equal(retry.action, "retry");
assert.equal(retry.summary, "Queued publishing job for retry.");

const merchant = merchantUpsertAuditData({
  mutation: {
    id: "merchant-1",
    name: "AliExpress",
    slug: "aliexpress",
    domain: "aliexpress.com",
    merchantType: "marketplace",
    allowedDomains: ["aliexpress.com"]
  },
  before: { id: "merchant-1", slug: "old" },
  after: { id: "merchant-1", slug: "aliexpress" }
});

assert.equal(merchant.action, "update");
assert.equal(merchant.summary, "Updated merchant aliexpress.");
assert.deepEqual(merchant.beforeJson, { id: "merchant-1", slug: "old" });

const offer = offerUpsertAuditData({
  mutation: {
    merchantId: "merchant-1",
    title: "65W charger",
    url: "https://example.test/charger",
    affiliateUrl: "https://example.test/charger?tag=demo",
    category: "chargers"
  },
  before: null,
  after: { id: "offer-1", title: "65W charger" }
});

assert.equal(offer.action, "create");
assert.equal(offer.summary, "Created offer 65W charger.");
assert.equal(offer.beforeJson, undefined);
assert.deepEqual(offer.afterJson, { id: "offer-1", title: "65W charger" });

console.log("Operations admin audit payload unit tests passed");
