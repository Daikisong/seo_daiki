import {
  priceSnapshotCreateData,
  sellerClaimCreateData,
  uniquePriceSnapshots,
  uniqueSellerClaims,
  uniqueVariants,
  variantCreateData
} from "./workerImportRecords";
import type { ImportSummary, ProductImportContext, WorkerPack } from "./workerImportRecords";
import type { WorkerEvidenceTransaction } from "./workerEvidenceImportMutations";

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
