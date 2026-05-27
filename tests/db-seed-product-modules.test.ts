import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import { createProductChildren, deleteProductChildren } from "../packages/db/src/seedProductChildren";
import type { SeedDbClient } from "../packages/db/src/seedTypes";

type Call = {
  data?: unknown;
  op: string;
  where?: unknown;
};

const calls: Call[] = [];
const db = seedDb(calls);

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  await deleteProductChildren(db, "prod-1");
  assert.deepEqual(calls.map((call) => call.op), [
    "variant.deleteMany",
    "sellerClaim.deleteMany",
    "verifiedClaim.deleteMany",
    "reviewSignal.deleteMany",
    "priceSnapshot.deleteMany",
    "marketRisk.deleteMany"
  ]);
  assert.deepEqual(calls.map((call) => call.where), Array.from({ length: 6 }, () => ({ productId: "prod-1" })));

  calls.length = 0;
  await createProductChildren(db, productFixture());
  assert.deepEqual(calls.map((call) => call.op), [
    "variant.create",
    "sellerClaim.create",
    "verifiedClaim.create",
    "reviewSignal.create",
    "priceSnapshot.create",
    "marketRisk.create"
  ]);

  const variantData = calls.find((call) => call.op === "variant.create")?.data as { riskFlags: unknown };
  assert.deepEqual(variantData.riskFlags, ["heat-risk"]);

  const sellerClaimData = calls.find((call) => call.op === "sellerClaim.create")?.data as { capturedAt: unknown };
  assert.ok(sellerClaimData.capturedAt instanceof Date);

  const verifiedClaimData = calls.find((call) => call.op === "verifiedClaim.create")?.data as { testedAt: unknown };
  assert.ok(verifiedClaimData.testedAt instanceof Date);

  const snapshotData = calls.find((call) => call.op === "priceSnapshot.create")?.data as { capturedAt: unknown };
  assert.ok(snapshotData.capturedAt instanceof Date);

  console.log("DB seed product child module tests passed");
}

function seedDb(target: Call[]) {
  const deleteMany = (op: string) => async ({ where }: { where: unknown }) => {
    target.push({ op, where });
  };
  const create = (op: string) => async ({ data }: { data: unknown }) => {
    target.push({ data, op });
  };

  return {
    marketRisk: {
      create: create("marketRisk.create"),
      deleteMany: deleteMany("marketRisk.deleteMany")
    },
    priceSnapshot: {
      create: create("priceSnapshot.create"),
      deleteMany: deleteMany("priceSnapshot.deleteMany")
    },
    reviewSignal: {
      create: create("reviewSignal.create"),
      deleteMany: deleteMany("reviewSignal.deleteMany")
    },
    sellerClaim: {
      create: create("sellerClaim.create"),
      deleteMany: deleteMany("sellerClaim.deleteMany")
    },
    variant: {
      create: create("variant.create"),
      deleteMany: deleteMany("variant.deleteMany")
    },
    verifiedClaim: {
      create: create("verifiedClaim.create"),
      deleteMany: deleteMany("verifiedClaim.deleteMany")
    }
  } as unknown as SeedDbClient;
}

function productFixture(): Product {
  return {
    id: "prod-1",
    canonicalName: "65W USB-C Charger",
    slug: "65w-usb-c-charger",
    category: "charger",
    identityConfidence: 0.92,
    imageHash: "hash-1",
    variants: [
      {
        id: "variant-1",
        productId: "prod-1",
        sourceSku: "sku-1",
        optionName: "US plug",
        wattageClaim: 65,
        plugType: "us",
        cableIncluded: false,
        sourceUrl: "https://example.com/product",
        affiliateUrl: "https://example.com/aff",
        sellerName: "Example seller",
        sellerId: "seller-1",
        riskFlags: ["heat-risk"]
      }
    ],
    sellerClaims: [
      {
        id: "claim-1",
        productId: "prod-1",
        claimType: "wattage",
        claimValue: "65W",
        rawText: "65W fast charging",
        sourceUrl: "https://example.com/product",
        capturedAt: "2026-05-28T00:00:00.000Z",
        confidence: 0.7
      }
    ],
    verifiedClaims: [
      {
        id: "verified-1",
        productId: "prod-1",
        testType: "output",
        resultValue: "62",
        unit: "W",
        method: "bench test",
        evidenceUrl: "https://example.com/evidence",
        confidence: 0.8,
        testedAt: "2026-05-29T00:00:00.000Z"
      }
    ],
    reviewSignals: [
      {
        id: "signal-1",
        productId: "prod-1",
        locale: "en",
        topic: "heat",
        sentiment: "negative",
        count: 12,
        confidence: 0.6,
        window: "30d"
      }
    ],
    priceSnapshots: [
      {
        id: "price-1",
        productId: "prod-1",
        variantId: "variant-1",
        country: "US",
        currency: "USD",
        price: 19.99,
        shipping: 0,
        coupon: 2,
        finalPrice: 17.99,
        capturedAt: "2026-05-30T00:00:00.000Z"
      }
    ],
    marketRisks: [
      {
        id: "risk-1",
        productId: "prod-1",
        locale: "en",
        country: "US",
        plugRisk: "low",
        customsRisk: "low",
        certificationRisk: "medium",
        returnRisk: "medium",
        localAlternativeNote: "Check local certified chargers.",
        score: 35
      }
    ]
  };
}
