import {
  claimKey,
  priceKey,
  riskKey,
  signalKey,
  uniqueRows,
  variantKey,
  verifiedClaimKey
} from "./workerImportDeduplication";
import { inferBrand, slugify } from "./workerImportProductParsing";
import { stringValue } from "./workerImportValueParsing";
import type { ProductImportContext, WorkerPack } from "./workerImportTypes";

export function groupWorkerPacksByProduct(packs: WorkerPack[]) {
  const byProduct = new Map<string, WorkerPack[]>();
  for (const pack of packs) {
    const productId = stringValue(pack.product_id);
    if (!productId) {
      continue;
    }
    byProduct.set(productId, [...(byProduct.get(productId) ?? []), pack]);
  }
  return byProduct;
}

export function productImportContext(productId: string, productPacks: WorkerPack[]): ProductImportContext {
  const product = productPacks.find((pack) => pack.product)?.product ?? {};
  const title = stringValue(product.title) || productId;
  return {
    product,
    title,
    slug: slugify(title) || productId,
    category: stringValue(product.category) || "uncategorized",
    brandClaim: inferBrand(title),
    identityConfidence: 0.7
  };
}

export function uniqueVariants(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.variants ?? []), variantKey);
}

export function uniqueSellerClaims(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.seller_claims ?? []), claimKey);
}

export function uniqueVerifiedClaims(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.verified_claims ?? []), verifiedClaimKey);
}

export function uniqueReviewSignals(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.review_signals ?? []), signalKey);
}

export function uniquePriceSnapshots(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.price_snapshots ?? []), priceKey);
}

export function uniqueMarketRisks(productPacks: WorkerPack[]) {
  return uniqueRows(productPacks.flatMap((pack) => pack.market_risks ?? []), riskKey);
}
