import assert from "node:assert/strict";
import {
  evidencePackMutationData,
  marketRiskMutationData,
  productMutationData,
  sellerClaimMutationData,
  variantMutationData,
  verifiedClaimMutationData
} from "../packages/db/src/adminMutationPayloads";

assert.deepEqual(
  productMutationData({
    canonicalName: "65W GaN Charger",
    slug: "65w-gan-charger",
    category: "charger"
  }),
  {
    canonicalName: "65W GaN Charger",
    slug: "65w-gan-charger",
    category: "charger",
    brandClaim: undefined,
    identityConfidence: 0.7,
    imageHash: undefined
  }
);

assert.equal(
  productMutationData({
    canonicalName: "Known Product",
    slug: "known-product",
    category: "charger",
    identityConfidence: 0
  }).identityConfidence,
  0
);

assert.deepEqual(
  variantMutationData({
    productId: "product-1",
    optionName: "EU plug",
    sourceUrl: "https://merchant.example.test/item",
    riskFlags: ["plug_mismatch", "cable_not_included"]
  }),
  {
    productId: "product-1",
    optionName: "EU plug",
    sourceUrl: "https://merchant.example.test/item",
    sourceSku: undefined,
    wattageClaim: undefined,
    plugType: undefined,
    cableIncluded: undefined,
    affiliateUrl: undefined,
    sellerName: undefined,
    sellerId: undefined,
    riskFlags: ["plug_mismatch", "cable_not_included"]
  }
);

assert.deepEqual(
  variantMutationData({
    productId: "product-1",
    optionName: "Default",
    sourceUrl: "https://merchant.example.test/item"
  }).riskFlags,
  []
);

assert.equal(
  sellerClaimMutationData({
    productId: "product-1",
    claimType: "wattage",
    claimValue: "65W"
  }).confidence,
  0.5
);

assert.equal(
  sellerClaimMutationData({
    productId: "product-1",
    claimType: "wattage",
    claimValue: "65W",
    confidence: 0.91
  }).confidence,
  0.91
);

const testedAt = new Date("2026-05-27T00:00:00.000Z");
assert.deepEqual(
  verifiedClaimMutationData({
    productId: "product-1",
    testType: "load-test",
    resultValue: "62",
    unit: "W",
    method: "USB power meter",
    testedAt
  }),
  {
    productId: "product-1",
    testType: "load-test",
    resultValue: "62",
    unit: "W",
    method: "USB power meter",
    evidenceUrl: undefined,
    confidence: 0.8,
    testedAt
  }
);

assert.equal(
  marketRiskMutationData({
    productId: "product-1",
    locale: "pt-br",
    country: "BR"
  }).score,
  0.5
);

assert.equal(
  marketRiskMutationData({
    productId: "product-1",
    locale: "pt-br",
    country: "BR",
    score: 0
  }).score,
  0
);

assert.deepEqual(
  evidencePackMutationData({
    productId: "product-1",
    locale: "en",
    packJson: {
      keep: "value",
      drop: undefined,
      nested: { count: 2 }
    }
  }),
  {
    productId: "product-1",
    locale: "en",
    packJson: {
      keep: "value",
      nested: { count: 2 }
    }
  }
);

console.log("Admin mutation payload unit tests passed");
