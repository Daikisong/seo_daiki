import type { Product } from "@global-import-lab/types";
import type { SeedDbClient } from "./seedTypes";
import { toSeedJson } from "./seedTypes";

export async function deleteProductChildren(db: SeedDbClient, productId: string) {
  await db.variant.deleteMany({ where: { productId } });
  await db.sellerClaim.deleteMany({ where: { productId } });
  await db.verifiedClaim.deleteMany({ where: { productId } });
  await db.reviewSignal.deleteMany({ where: { productId } });
  await db.priceSnapshot.deleteMany({ where: { productId } });
  await db.marketRisk.deleteMany({ where: { productId } });
}

export async function createProductChildren(db: SeedDbClient, product: Product) {
  for (const variant of product.variants) {
    await db.variant.create({
      data: {
        id: variant.id,
        productId: variant.productId,
        sourceSku: variant.sourceSku,
        optionName: variant.optionName,
        wattageClaim: variant.wattageClaim,
        plugType: variant.plugType,
        cableIncluded: variant.cableIncluded,
        sourceUrl: variant.sourceUrl,
        affiliateUrl: variant.affiliateUrl,
        sellerName: variant.sellerName,
        sellerId: variant.sellerId,
        riskFlags: toSeedJson(variant.riskFlags ?? [])
      }
    });
  }

  for (const claim of product.sellerClaims) {
    await db.sellerClaim.create({ data: { ...claim, capturedAt: new Date(claim.capturedAt) } });
  }

  for (const claim of product.verifiedClaims) {
    await db.verifiedClaim.create({
      data: { ...claim, testedAt: claim.testedAt ? new Date(claim.testedAt) : undefined }
    });
  }

  for (const signal of product.reviewSignals) {
    await db.reviewSignal.create({ data: signal });
  }

  for (const snapshot of product.priceSnapshots) {
    await db.priceSnapshot.create({
      data: {
        ...snapshot,
        capturedAt: new Date(snapshot.capturedAt)
      }
    });
  }

  for (const risk of product.marketRisks) {
    await db.marketRisk.create({ data: risk });
  }
}
