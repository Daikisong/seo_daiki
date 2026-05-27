import { productImportContext, productUpsertData } from "./workerImportRecords";
import type { ImportSummary, WorkerPack } from "./workerImportRecords";
import { insertWorkerEvidenceChildren } from "./workerEvidenceImportInsertions";
import {
  clearWorkerEvidenceForProduct,
  upsertWorkerProduct,
  type WorkerEvidenceTransaction
} from "./workerEvidenceImportMutations";

export async function importWorkerEvidenceProduct(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  summary: ImportSummary
) {
  const context = productImportContext(productId, productPacks);
  const productData = productUpsertData(context);

  await upsertWorkerProduct(tx, productId, productData);
  summary.products += 1;

  await clearWorkerEvidenceForProduct(tx, productId);
  await insertWorkerEvidenceChildren(tx, productId, productPacks, context, summary);
}
