import assert from "node:assert/strict";
import {
  mapDbPriceSnapshot,
  mapDbVariant
} from "../packages/db/src/contentRepositoryProductChildMappers";
import type { DbPriceSnapshotRow, DbVariantRow } from "../packages/db/src/contentRepositoryProductRows";

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

console.log("Content repository product mapper module tests passed");
