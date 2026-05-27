import assert from "node:assert/strict";
import { emptyWorkerImportSummary, type WorkerPack } from "../packages/db/src/workerImportRecords";
import { insertWorkerEvidenceChildren } from "../packages/db/src/workerEvidenceImportInsertions";
import {
  clearWorkerEvidenceForProduct,
  upsertWorkerProduct,
  type WorkerEvidenceTransaction
} from "../packages/db/src/workerEvidenceImportMutations";
import { importWorkerEvidenceProduct } from "../packages/db/src/workerEvidenceImportTransaction";

type Operation = { model: string; action: string; args: unknown };

function childDelegate(model: string, operations: Operation[]) {
  return {
    async create(args: unknown) {
      operations.push({ model, action: "create", args });
    },
    async deleteMany(args: unknown) {
      operations.push({ model, action: "deleteMany", args });
    }
  };
}

function fakeTx(operations: Operation[]): WorkerEvidenceTransaction {
  return {
    product: {
      async upsert(args: unknown) {
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
    seller_claims: [{ claim_type: "wattage", claim_value: "65W", raw_text: "Seller says 65W" }],
    verified_claims: [{ test_type: "wattage", result_value: "61", unit: "W", method: "USB meter" }],
    review_signals: [{ locale: "en", topic: "heat", sentiment: "negative", count: "4" }],
    price_snapshots: [{ country: "US", currency: "USD", price: "18", shipping: "2", final_price: "20" }],
    market_risks: [{ locale: "en", country: "US", plug_risk: "low", score: "0.6" }]
  },
  { product_id: "prod-1", locale: "es", product: { title: "Ignored duplicate product title" } }
];

async function main() {
  const operations: Operation[] = [];
  const tx = fakeTx(operations);
  const summary = { ...emptyWorkerImportSummary };
  await importWorkerEvidenceProduct(tx, "prod-1", packs, summary);

  assert.deepEqual(summary, {
    products: 1,
    variants: 1,
    sellerClaims: 1,
    verifiedClaims: 1,
    reviewSignals: 1,
    priceSnapshots: 1,
    marketRisks: 1,
    evidencePacks: 2
  });
  assert.deepEqual(
    operations.map((operation) => `${operation.model}.${operation.action}`),
    [
      "product.upsert",
      "variant.deleteMany",
      "sellerClaim.deleteMany",
      "verifiedClaim.deleteMany",
      "reviewSignal.deleteMany",
      "priceSnapshot.deleteMany",
      "marketRisk.deleteMany",
      "evidencePack.deleteMany",
      "variant.create",
      "sellerClaim.create",
      "verifiedClaim.create",
      "reviewSignal.create",
      "priceSnapshot.create",
      "marketRisk.create",
      "evidencePack.create",
      "evidencePack.create"
    ]
  );

  const splitOperations: Operation[] = [];
  await upsertWorkerProduct(fakeTx(splitOperations), "prod-2", { canonicalName: "Product Two" });
  assert.equal(splitOperations[0]?.model, "product");

  const clearOperations: Operation[] = [];
  await clearWorkerEvidenceForProduct(fakeTx(clearOperations), "prod-3");
  assert.equal(clearOperations.length, 7);
  assert.equal(clearOperations[0]?.action, "deleteMany");

  const insertOperations: Operation[] = [];
  const insertSummary = { ...emptyWorkerImportSummary };
  await insertWorkerEvidenceChildren(
    fakeTx(insertOperations),
    "prod-1",
    packs,
    {
      product: packs[0]?.product ?? {},
      title: "Baseus 65W GaN Charger",
      slug: "baseus-65w-gan-charger",
      category: "usb-c-chargers",
      brandClaim: "Baseus",
      identityConfidence: 0.7
    },
    insertSummary
  );
  assert.equal(insertSummary.products, 0);
  assert.equal(insertSummary.evidencePacks, 2);
  assert.equal(insertOperations[0]?.model, "variant");

  console.log("Worker evidence importer module tests passed");
}

void main();
