import { evidencePackCreateData } from "./workerImportRecords";
import type { ImportSummary, WorkerPack } from "./workerImportRecords";
import type { WorkerEvidenceTransaction } from "./workerEvidenceImportMutations";

export async function insertWorkerEvidencePacks(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  summary: ImportSummary
) {
  for (const pack of productPacks) {
    await tx.evidencePack.create({
      data: evidencePackCreateData(productId, pack)
    });
    summary.evidencePacks += 1;
  }
}
