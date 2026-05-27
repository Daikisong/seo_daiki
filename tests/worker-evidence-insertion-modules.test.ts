import assert from "node:assert/strict";
import { emptyWorkerImportSummary, type WorkerPack } from "../packages/db/src/workerImportRecords";
import {
  insertWorkerEvidencePacks,
  insertWorkerPriceSnapshots,
  insertWorkerReviewSignals,
  insertWorkerVariants,
  insertWorkerVerifiedClaims
} from "../packages/db/src/workerEvidenceImportInsertions";
import { insertWorkerVariants as directInsertWorkerVariants } from "../packages/db/src/workerEvidenceCatalogInsertions";
import { insertWorkerEvidencePacks as directInsertWorkerEvidencePacks } from "../packages/db/src/workerEvidencePackInsertions";
import {
  insertWorkerReviewSignals as directInsertWorkerReviewSignals,
  insertWorkerVerifiedClaims as directInsertWorkerVerifiedClaims
} from "../packages/db/src/workerEvidenceSignalInsertions";
import type { WorkerEvidenceTransaction } from "../packages/db/src/workerEvidenceImportMutations";

type Operation = { model: string; action: string; args: any };

const packs: WorkerPack[] = [
  {
    product_id: "prod-1",
    locale: "en",
    product: {
      title: "Baseus 65W GaN Charger",
      category: "usb-c-chargers",
      source_url: "https://example.com/source/baseus",
      seller: "Baseus Store",
      currency: "USD",
      price: "19.99",
      shipping: "2.50",
      captured_at: "2026-05-27T00:00:00.000Z"
    },
    variants: [{ option: "65W EU with cable", source_sku: "sku-eu" }],
    seller_claims: [],
    verified_claims: [{ test_type: "wattage", result_value: "61", unit: "W", method: "USB meter" }],
    review_signals: [{ locale: "en", topic: "heat", sentiment: "negative", count: "4" }],
    price_snapshots: [{ country: "US", currency: "USD", price: "18", shipping: "2", final_price: "20" }],
    market_risks: []
  },
  { product_id: "prod-1", locale: "es", product: { title: "Ignored duplicate product title" } }
];

assert.equal(insertWorkerVariants, directInsertWorkerVariants);
assert.equal(insertWorkerEvidencePacks, directInsertWorkerEvidencePacks);
assert.equal(insertWorkerReviewSignals, directInsertWorkerReviewSignals);
assert.equal(insertWorkerVerifiedClaims, directInsertWorkerVerifiedClaims);

async function main() {
  await testCatalogInsertionModule();
  await testSignalInsertionModule();
  await testPackInsertionModule();
  console.log("Worker evidence insertion module tests passed");
}

async function testCatalogInsertionModule() {
  const operations: Operation[] = [];
  const summary = { ...emptyWorkerImportSummary };
  await insertWorkerVariants(fakeTx(operations), "prod-1", packs, context(), summary);
  await insertWorkerPriceSnapshots(fakeTx(operations), "prod-1", packs, context(), summary);

  assert.equal(summary.variants, 1);
  assert.equal(summary.priceSnapshots, 1);
  assert.deepEqual(operations.map((operation) => operation.model), ["variant", "priceSnapshot"]);
  assert.equal(operations[0].args.data.productId, "prod-1");
}

async function testSignalInsertionModule() {
  const operations: Operation[] = [];
  const summary = { ...emptyWorkerImportSummary };
  await insertWorkerVerifiedClaims(fakeTx(operations), "prod-1", packs, summary);
  await insertWorkerReviewSignals(fakeTx(operations), "prod-1", packs, summary);

  assert.equal(summary.verifiedClaims, 1);
  assert.equal(summary.reviewSignals, 1);
  assert.deepEqual(operations.map((operation) => operation.model), ["verifiedClaim", "reviewSignal"]);
}

async function testPackInsertionModule() {
  const operations: Operation[] = [];
  const summary = { ...emptyWorkerImportSummary };
  await insertWorkerEvidencePacks(fakeTx(operations), "prod-1", packs, summary);

  assert.equal(summary.evidencePacks, 2);
  assert.deepEqual(operations.map((operation) => operation.model), ["evidencePack", "evidencePack"]);
  assert.equal(operations[0].args.data.locale, "en");
}

function context() {
  return {
    product: packs[0].product,
    title: "Baseus 65W GaN Charger",
    slug: "baseus-65w-gan-charger",
    category: "usb-c-chargers",
    brandClaim: "Baseus",
    identityConfidence: 0.7
  };
}

function childDelegate(model: string, operations: Operation[]) {
  return {
    async create(args: any) {
      operations.push({ model, action: "create", args });
    },
    async deleteMany(args: any) {
      operations.push({ model, action: "deleteMany", args });
    }
  };
}

function fakeTx(operations: Operation[]): WorkerEvidenceTransaction {
  return {
    product: {
      async upsert(args: any) {
        operations.push({ model: "product", action: "upsert", args });
      }
    },
    variant: childDelegate("variant", operations),
    sellerClaim: childDelegate("sellerClaim", operations),
    verifiedClaim: childDelegate("verifiedClaim", operations),
    reviewSignal: childDelegate("reviewSignal", operations),
    priceSnapshot: childDelegate("priceSnapshot", operations),
    marketRisk: childDelegate("marketRisk", operations),
    evidencePack: childDelegate("evidencePack", operations)
  };
}

void main();
