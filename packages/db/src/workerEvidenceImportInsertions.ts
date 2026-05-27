import {
  insertWorkerPriceSnapshots,
  insertWorkerSellerClaims,
  insertWorkerVariants
} from "./workerEvidenceCatalogInsertions";
import { insertWorkerEvidencePacks } from "./workerEvidencePackInsertions";
import {
  insertWorkerMarketRisks,
  insertWorkerReviewSignals,
  insertWorkerVerifiedClaims
} from "./workerEvidenceSignalInsertions";
import type { ImportSummary, ProductImportContext, WorkerPack } from "./workerImportRecords";
import type { WorkerEvidenceTransaction } from "./workerEvidenceImportMutations";

export async function insertWorkerEvidenceChildren(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  context: ProductImportContext,
  summary: ImportSummary
) {
  await insertWorkerVariants(tx, productId, productPacks, context, summary);
  await insertWorkerSellerClaims(tx, productId, productPacks, context, summary);
  await insertWorkerVerifiedClaims(tx, productId, productPacks, summary);
  await insertWorkerReviewSignals(tx, productId, productPacks, summary);
  await insertWorkerPriceSnapshots(tx, productId, productPacks, context, summary);
  await insertWorkerMarketRisks(tx, productId, productPacks, summary);
  await insertWorkerEvidencePacks(tx, productId, productPacks, summary);
}

export {
  insertWorkerPriceSnapshots,
  insertWorkerSellerClaims,
  insertWorkerVariants
} from "./workerEvidenceCatalogInsertions";
export { insertWorkerEvidencePacks } from "./workerEvidencePackInsertions";
export {
  insertWorkerMarketRisks,
  insertWorkerReviewSignals,
  insertWorkerVerifiedClaims
} from "./workerEvidenceSignalInsertions";
