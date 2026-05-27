import { prisma } from "./client";
import {
  emptyWorkerImportSummary,
  evidencePackCreateData,
  groupWorkerPacksByProduct,
  marketRiskCreateData,
  priceSnapshotCreateData,
  productImportContext,
  productUpsertData,
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
import { findProjectRoot, loadWorkerEvidencePacks } from "./workerImportPaths";

export async function importWorkerEvidence(root = findProjectRoot()) {
  const packs = loadWorkerEvidencePacks(root);
  const byProduct = groupWorkerPacksByProduct(packs);

  const summary = { ...emptyWorkerImportSummary };
  for (const [productId, productPacks] of byProduct) {
    const context = productImportContext(productId, productPacks);
    const productData = productUpsertData(context);

    await prisma.$transaction(async (tx) => {
      await tx.product.upsert({
        where: { id: productId },
        update: productData,
        create: {
          id: productId,
          ...productData
        }
      });
      summary.products += 1;

      await tx.variant.deleteMany({ where: { productId } });
      await tx.sellerClaim.deleteMany({ where: { productId } });
      await tx.verifiedClaim.deleteMany({ where: { productId } });
      await tx.reviewSignal.deleteMany({ where: { productId } });
      await tx.priceSnapshot.deleteMany({ where: { productId } });
      await tx.marketRisk.deleteMany({ where: { productId } });
      await tx.evidencePack.deleteMany({ where: { productId } });

      for (const variant of uniqueVariants(productPacks)) {
        await tx.variant.create({
          data: variantCreateData(productId, context.product, variant)
        });
        summary.variants += 1;
      }

      for (const claim of uniqueSellerClaims(productPacks)) {
        await tx.sellerClaim.create({
          data: sellerClaimCreateData(productId, context.product, claim)
        });
        summary.sellerClaims += 1;
      }

      for (const claim of uniqueVerifiedClaims(productPacks)) {
        await tx.verifiedClaim.create({
          data: verifiedClaimCreateData(productId, claim)
        });
        summary.verifiedClaims += 1;
      }

      for (const signal of uniqueReviewSignals(productPacks)) {
        await tx.reviewSignal.create({
          data: reviewSignalCreateData(productId, signal)
        });
        summary.reviewSignals += 1;
      }

      for (const snapshot of uniquePriceSnapshots(productPacks)) {
        await tx.priceSnapshot.create({
          data: priceSnapshotCreateData(productId, context.product, snapshot)
        });
        summary.priceSnapshots += 1;
      }

      for (const risk of uniqueMarketRisks(productPacks)) {
        await tx.marketRisk.create({
          data: marketRiskCreateData(productId, risk)
        });
        summary.marketRisks += 1;
      }

      for (const pack of productPacks) {
        await tx.evidencePack.create({
          data: evidencePackCreateData(productId, pack)
        });
        summary.evidencePacks += 1;
      }
    });
  }

  return summary;
}
