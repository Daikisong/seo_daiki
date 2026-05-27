import assert from "node:assert/strict";
import {
  mapDbMarketRisk,
  mapDbPriceSnapshot,
  mapDbReviewSignal,
  mapDbSellerClaim,
  mapDbVariant
} from "../packages/db/src/contentRepositoryProductChildMappers";
import {
  mapDbReviewSignal as directMapDbReviewSignal,
  mapDbSellerClaim as directMapDbSellerClaim
} from "../packages/db/src/contentRepositoryClaimMappers";
import {
  mapDbMarketRisk as directMapDbMarketRisk,
  mapDbPriceSnapshot as directMapDbPriceSnapshot
} from "../packages/db/src/contentRepositoryMarketMappers";
import { mapDbVariant as directMapDbVariant } from "../packages/db/src/contentRepositoryVariantMappers";
import type {
  DbMarketRiskRow,
  DbPriceSnapshotRow,
  DbReviewSignalRow,
  DbSellerClaimRow,
  DbVariantRow
} from "../packages/db/src/contentRepositoryProductRows";

assert.equal(mapDbVariant, directMapDbVariant);
assert.equal(mapDbSellerClaim, directMapDbSellerClaim);
assert.equal(mapDbReviewSignal, directMapDbReviewSignal);
assert.equal(mapDbPriceSnapshot, directMapDbPriceSnapshot);
assert.equal(mapDbMarketRisk, directMapDbMarketRisk);

const variant: DbVariantRow = {
  id: "variant-1",
  productId: "product-1",
  sourceSku: null,
  optionName: "US plug",
  wattageClaim: 65,
  plugType: "US",
  cableIncluded: true,
  sourceUrl: "https://merchant.example/charger",
  affiliateUrl: null,
  sellerName: null,
  sellerId: null,
  riskFlags: ["plug_mismatch"]
};

assert.deepEqual(mapDbVariant(variant).riskFlags, ["plug_mismatch"]);
assert.equal(mapDbVariant({ ...variant, riskFlags: { invalid: true } }).riskFlags.length, 0);

const snapshot: DbPriceSnapshotRow = {
  id: "price-1",
  productId: "product-1",
  variantId: null,
  country: "US",
  currency: "USD",
  price: "19.99",
  shipping: null,
  coupon: "2.00",
  finalPrice: "17.99",
  capturedAt: new Date("2026-05-25T00:00:00.000Z")
};

assert.equal(mapDbPriceSnapshot(snapshot).price, 19.99);
assert.equal(mapDbPriceSnapshot(snapshot).shipping, undefined);
assert.equal(mapDbPriceSnapshot(snapshot).coupon, 2);
assert.equal(mapDbPriceSnapshot(snapshot).capturedAt, "2026-05-25");

const sellerClaim: DbSellerClaimRow = {
  id: "claim-1",
  productId: "product-1",
  claimType: "wattage",
  claimValue: "65W",
  rawText: null,
  sourceUrl: null,
  capturedAt: new Date("2026-05-24T00:00:00.000Z"),
  confidence: 0.8
};

assert.equal(mapDbSellerClaim(sellerClaim).capturedAt, "2026-05-24");
assert.equal(mapDbSellerClaim(sellerClaim).rawText, undefined);

const reviewSignal: DbReviewSignalRow = {
  id: "review-1",
  productId: "product-1",
  locale: "en",
  topic: "heat",
  sentiment: "negative",
  count: 4,
  confidence: 0.7,
  window: null
};

assert.equal(mapDbReviewSignal(reviewSignal).sentiment, "negative");
assert.equal(mapDbReviewSignal(reviewSignal).window, undefined);

const risk: DbMarketRiskRow = {
  id: "risk-1",
  productId: "product-1",
  locale: "en",
  country: "US",
  plugRisk: null,
  customsRisk: null,
  certificationRisk: "needs UL verification",
  returnRisk: null,
  localAlternativeNote: null,
  score: 0.6
};

assert.equal(mapDbMarketRisk(risk).certificationRisk, "needs UL verification");
assert.equal(mapDbMarketRisk(risk).plugRisk, undefined);

console.log("Content repository product mapper module tests passed");
