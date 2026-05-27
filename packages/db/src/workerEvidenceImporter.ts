import { prisma } from "./client";
import { emptyWorkerImportSummary, groupWorkerPacksByProduct } from "./workerImportRecords";
import { findProjectRoot, loadWorkerEvidencePacks } from "./workerImportPaths";
import { importWorkerEvidenceProduct } from "./workerEvidenceImportTransaction";

export async function importWorkerEvidence(root = findProjectRoot()) {
  const packs = loadWorkerEvidencePacks(root);
  const byProduct = groupWorkerPacksByProduct(packs);

  const summary = { ...emptyWorkerImportSummary };
  for (const [productId, productPacks] of byProduct) {
    await prisma.$transaction(async (tx) => {
      await importWorkerEvidenceProduct(tx, productId, productPacks, summary);
    });
  }

  return summary;
}
