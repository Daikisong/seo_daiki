import {
  evidencePackCreateData,
  marketRiskCreateData,
  priceSnapshotCreateData,
  reviewSignalCreateData,
  sellerClaimCreateData,
  uniqueMarketRisks,
  uniquePriceSnapshots,
  uniqueReviewSignals,
  uniqueSellerClaims,
  uniqueVariants,
  uniqueVerifiedClaims,
  variantCreateData,
  verifiedClaimCreateData
} from "./workerImportRecords";
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

export async function insertWorkerVariants(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  context: ProductImportContext,
  summary: ImportSummary
) {
  for (const variant of uniqueVariants(productPacks)) {
    await tx.variant.create({
      data: variantCreateData(productId, context.product, variant)
    });
    summary.variants += 1;
  }
}

export async function insertWorkerSellerClaims(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  context: ProductImportContext,
  summary: ImportSummary
) {
  for (const claim of uniqueSellerClaims(productPacks)) {
    await tx.sellerClaim.create({
      data: sellerClaimCreateData(productId, context.product, claim)
    });
    summary.sellerClaims += 1;
  }
}

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

export async function insertWorkerPriceSnapshots(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productPacks: WorkerPack[],
  context: ProductImportContext,
  summary: ImportSummary
) {
  for (const snapshot of uniquePriceSnapshots(productPacks)) {
    await tx.priceSnapshot.create({
      data: priceSnapshotCreateData(productId, context.product, snapshot)
    });
    summary.priceSnapshots += 1;
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
