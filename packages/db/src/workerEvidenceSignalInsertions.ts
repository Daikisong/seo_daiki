import {
  marketRiskCreateData,
  reviewSignalCreateData,
  uniqueMarketRisks,
  uniqueReviewSignals,
  uniqueVerifiedClaims,
  verifiedClaimCreateData
} from "./workerImportRecords";
import type { ImportSummary, WorkerPack } from "./workerImportRecords";
import type { WorkerEvidenceTransaction } from "./workerEvidenceImportMutations";

export async function insertWorkerVerifiedClaims(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  summary: ImportSummary
) {
  for (const claim of uniqueVerifiedClaims(productPacks)) {
    await tx.verifiedClaim.create({
      data: verifiedClaimCreateData(productId, claim)
    });
    summary.verifiedClaims += 1;
  }
}

export async function insertWorkerReviewSignals(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  summary: ImportSummary
) {
  for (const signal of uniqueReviewSignals(productPacks)) {
    await tx.reviewSignal.create({
      data: reviewSignalCreateData(productId, signal)
    });
    summary.reviewSignals += 1;
  }
}

export async function insertWorkerMarketRisks(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  summary: ImportSummary
) {
  for (const risk of uniqueMarketRisks(productPacks)) {
    await tx.marketRisk.create({
      data: marketRiskCreateData(productId, risk)
    });
    summary.marketRisks += 1;
  }
}
