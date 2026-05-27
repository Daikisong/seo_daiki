import assert from "node:assert/strict";
import {
  adminOperationAction,
  boundedTrendSignalLimit,
  contentBriefStatuses,
  merchantAuditSummary,
  merchantMutationData,
  offerAuditSummary,
  offerMutationData,
  publishingJobStatuses,
  toJson,
  topicStatuses
} from "../packages/db/src/operationsAdminModel";
import {
  adminOperationAction as directAdminOperationAction,
  merchantAuditSummary as directMerchantAuditSummary,
  offerAuditSummary as directOfferAuditSummary
} from "../packages/db/src/operationsAdminAuditModel";
import {
  merchantMutationData as directMerchantMutationData,
  offerMutationData as directOfferMutationData
} from "../packages/db/src/operationsAdminCommerceModel";
import { toJson as directToJson } from "../packages/db/src/operationsAdminJson";
import { boundedTrendSignalLimit as directBoundedTrendSignalLimit } from "../packages/db/src/operationsAdminLimits";
import {
  contentBriefStatuses as directContentBriefStatuses,
  publishingJobStatuses as directPublishingJobStatuses,
  topicStatuses as directTopicStatuses
} from "../packages/db/src/operationsAdminStatuses";

assert.equal(adminOperationAction, directAdminOperationAction);
assert.equal(merchantAuditSummary, directMerchantAuditSummary);
assert.equal(offerAuditSummary, directOfferAuditSummary);
assert.equal(merchantMutationData, directMerchantMutationData);
assert.equal(offerMutationData, directOfferMutationData);
assert.equal(toJson, directToJson);
assert.equal(boundedTrendSignalLimit, directBoundedTrendSignalLimit);
assert.equal(topicStatuses, directTopicStatuses);
assert.equal(contentBriefStatuses, directContentBriefStatuses);
assert.equal(publishingJobStatuses, directPublishingJobStatuses);

assert.deepEqual(topicStatuses, ["candidate", "briefed", "drafted", "published", "rejected"]);
assert.equal(boundedTrendSignalLimit(-20), 1);
assert.equal(boundedTrendSignalLimit(9999), 500);
assert.equal(adminOperationAction({ id: "merchant-1" }), "update");
assert.equal(merchantAuditSummary({}, "aliexpress"), "Created merchant aliexpress.");
assert.deepEqual(toJson({ nested: ["a", "b"] }), { nested: ["a", "b"] });

assert.equal(
  merchantMutationData({
    name: "iHerb",
    slug: "iherb",
    domain: "iherb.com",
    merchantType: "supplement_store",
    allowedDomains: ["iherb.com"],
    healthSensitive: true
  }).defaultRel,
  "sponsored nofollow"
);

const offerData = offerMutationData({
  merchantId: "merchant-1",
  title: "Magnesium sample",
  url: "https://merchant.example.test/magnesium",
  affiliateUrl: "https://merchant.example.test/magnesium?tag=demo",
  category: "wellness",
  lastCheckedAt: "2026-05-27T00:00:00.000Z"
});

assert.equal(offerData.status, "active");
assert.equal(offerData.evidenceLevel, "merchant_claim");
assert.equal(offerData.lastCheckedAt?.toISOString(), "2026-05-27T00:00:00.000Z");

console.log("Operations admin model module tests passed");
