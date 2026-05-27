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
  topicStatuses
} from "../packages/db/src/operationsAdminModel";

assert.deepEqual(topicStatuses, ["candidate", "briefed", "drafted", "published", "rejected"]);
assert.deepEqual(contentBriefStatuses, ["draft", "approved", "rejected", "converted"]);
assert.deepEqual(publishingJobStatuses, ["queued", "running", "done", "failed", "blocked"]);

assert.equal(boundedTrendSignalLimit(undefined), 100);
assert.equal(boundedTrendSignalLimit(-20), 1);
assert.equal(boundedTrendSignalLimit(25), 25);
assert.equal(boundedTrendSignalLimit(9999), 500);

assert.deepEqual(
  merchantMutationData({
    name: "AliExpress",
    slug: "aliexpress",
    domain: "aliexpress.com",
    merchantType: "marketplace",
    allowedDomains: ["ALIEXPRESS.COM", "s.click.aliexpress.com"]
  }),
  {
    name: "AliExpress",
    slug: "aliexpress",
    domain: "aliexpress.com",
    merchantType: "marketplace",
    allowedDomains: ["ALIEXPRESS.COM", "s.click.aliexpress.com"],
    defaultRel: "sponsored nofollow",
    healthSensitive: false,
    enabled: true
  }
);

assert.equal(
  merchantMutationData({
    name: "iHerb",
    slug: "iherb",
    domain: "iherb.com",
    merchantType: "supplement_store",
    allowedDomains: ["iherb.com"],
    defaultRel: "nofollow",
    healthSensitive: true,
    enabled: false
  }).enabled,
  false
);

const offerData = offerMutationData({
  merchantId: "merchant-1",
  title: "Magnesium sample",
  url: "https://merchant.example.test/magnesium",
  affiliateUrl: "https://merchant.example.test/magnesium?tag=demo",
  category: "wellness",
  price: "12.50",
  locale: "en",
  country: "US",
  lastCheckedAt: "2026-05-27T00:00:00.000Z"
});

assert.equal(offerData.programId, null);
assert.equal(offerData.productId, null);
assert.equal(offerData.topicId, null);
assert.equal(offerData.description, null);
assert.equal(offerData.evidenceLevel, "merchant_claim");
assert.equal(offerData.healthSensitive, false);
assert.equal(offerData.status, "active");
assert.equal(offerData.lastCheckedAt?.toISOString(), "2026-05-27T00:00:00.000Z");

assert.equal(adminOperationAction({}), "create");
assert.equal(adminOperationAction({ id: "merchant-1" }), "update");
assert.equal(merchantAuditSummary({}, "aliexpress"), "Created merchant aliexpress.");
assert.equal(merchantAuditSummary({ id: "merchant-1" }, "aliexpress"), "Updated merchant aliexpress.");
assert.equal(offerAuditSummary({}, "65W charger"), "Created offer 65W charger.");
assert.equal(offerAuditSummary({ id: "offer-1" }, "65W charger"), "Updated offer 65W charger.");

console.log("Operations admin model unit tests passed");
