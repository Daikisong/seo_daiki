import assert from "node:assert/strict";
import {
  merchantUpsertAuditData,
  offerUpsertAuditData
} from "../packages/db/src/operationsAdminCommerceAuditPayloads";
import {
  contentBriefStatusUpdatedAuditData,
  publishingJobCreatedAuditData,
  publishingJobRetryAuditData,
  topicStatusUpdatedAuditData
} from "../packages/db/src/operationsAdminWorkflowAuditPayloads";
import {
  contentBriefStatusUpdatedAuditData as exportedContentBriefStatusUpdatedAuditData,
  merchantUpsertAuditData as exportedMerchantUpsertAuditData,
  offerUpsertAuditData as exportedOfferUpsertAuditData,
  publishingJobCreatedAuditData as exportedPublishingJobCreatedAuditData,
  publishingJobRetryAuditData as exportedPublishingJobRetryAuditData,
  topicStatusUpdatedAuditData as exportedTopicStatusUpdatedAuditData
} from "../packages/db/src/operationsAdminAuditPayloads";

assert.equal(exportedContentBriefStatusUpdatedAuditData, contentBriefStatusUpdatedAuditData);
assert.equal(exportedMerchantUpsertAuditData, merchantUpsertAuditData);
assert.equal(exportedOfferUpsertAuditData, offerUpsertAuditData);
assert.equal(exportedPublishingJobCreatedAuditData, publishingJobCreatedAuditData);
assert.equal(exportedPublishingJobRetryAuditData, publishingJobRetryAuditData);
assert.equal(exportedTopicStatusUpdatedAuditData, topicStatusUpdatedAuditData);

assert.equal(
  publishingJobCreatedAuditData({ row: { id: "job-1" }, jobType: "generate_content_brief" }).summary,
  "Queued publishing job generate_content_brief."
);
assert.equal(
  merchantUpsertAuditData({
    mutation: {
      id: "merchant-1",
      name: "AliExpress",
      slug: "aliexpress",
      domain: "aliexpress.com",
      merchantType: "marketplace",
      allowedDomains: ["aliexpress.com"]
    },
    before: null,
    after: { id: "merchant-1", slug: "aliexpress" }
  }).summary,
  "Updated merchant aliexpress."
);

console.log("Operations admin audit payload module tests passed");
