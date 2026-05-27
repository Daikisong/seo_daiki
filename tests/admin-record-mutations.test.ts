import assert from "node:assert/strict";
import {
  deleteAdminRecordByType,
  findAdminRecord,
  updateArchivedAt
} from "../packages/db/src/adminRecordMutations";

const archivedAt = new Date("2026-05-27T00:00:00.000Z");

async function main() {
  await testFindAdminRecord();
  await testArchiveArticle();
  await testArchiveVariant();
  await testDeleteEvidencePack();
  console.log("Admin record mutation delegate unit tests passed");
}

async function testFindAdminRecord() {
  const tx = fakeTransaction();
  const row = await findAdminRecord(tx, "product", "product-1");

  assert.deepEqual(row, { delegate: "product", method: "findUnique", args: { where: { id: "product-1" } } });
  assert.deepEqual(tx.calls, [{ delegate: "product", method: "findUnique", args: { where: { id: "product-1" } } }]);
}

async function testArchiveArticle() {
  const tx = fakeTransaction();
  await updateArchivedAt(tx, "article", "article-1", archivedAt);

  assert.deepEqual(tx.calls, [
    {
      delegate: "article",
      method: "update",
      args: {
        where: { id: "article-1" },
        data: { archivedAt, indexStatus: "noindex", publishStatus: "draft" }
      }
    }
  ]);
}

async function testArchiveVariant() {
  const tx = fakeTransaction();
  await updateArchivedAt(tx, "variant", "variant-1", archivedAt);

  assert.deepEqual(tx.calls, [
    {
      delegate: "variant",
      method: "update",
      args: {
        where: { id: "variant-1" },
        data: { archivedAt }
      }
    }
  ]);
}

async function testDeleteEvidencePack() {
  const tx = fakeTransaction();
  await deleteAdminRecordByType(tx, "evidence-pack", "pack-1");

  assert.deepEqual(tx.calls, [
    {
      delegate: "evidencePack",
      method: "delete",
      args: { where: { id: "pack-1" } }
    }
  ]);
}

function fakeTransaction() {
  const calls: Array<{ delegate: string; method: string; args: unknown }> = [];
  const delegate = (name: string) => ({
    findUnique(args: unknown) {
      const row = { delegate: name, method: "findUnique", args };
      calls.push(row);
      return Promise.resolve(row);
    },
    update(args: unknown) {
      const row = { delegate: name, method: "update", args };
      calls.push(row);
      return Promise.resolve(row);
    },
    delete(args: unknown) {
      const row = { delegate: name, method: "delete", args };
      calls.push(row);
      return Promise.resolve(row);
    }
  });

  return {
    calls,
    article: delegate("article"),
    evidencePack: delegate("evidencePack"),
    marketRisk: delegate("marketRisk"),
    product: delegate("product"),
    sellerClaim: delegate("sellerClaim"),
    variant: delegate("variant"),
    verifiedClaim: delegate("verifiedClaim")
  } as any;
}

main();
