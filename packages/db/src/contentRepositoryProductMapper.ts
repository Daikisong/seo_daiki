import type { Product } from "@global-import-lab/types";
import {
  mapDbMarketRisk,
  mapDbPriceSnapshot,
  mapDbReviewSignal,
  mapDbSellerClaim,
  mapDbVariant,
  mapDbVerifiedClaim
} from "./contentRepositoryProductChildMappers";
import type { DbProductRow } from "./contentRepositoryProductRows";

export type { DbProductRow } from "./contentRepositoryProductRows";

export function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    canonicalName: row.canonicalName,
    slug: row.slug,
    category: row.category,
    brandClaim: row.brandClaim ?? undefined,
    identityConfidence: row.identityConfidence,
    imageHash: row.imageHash ?? undefined,
    variants: row.variants.map(mapDbVariant),
    sellerClaims: row.sellerClaims.map(mapDbSellerClaim),
    verifiedClaims: row.verifiedClaims.map(mapDbVerifiedClaim),
    reviewSignals: row.reviewSignals.map(mapDbReviewSignal),
    priceSnapshots: row.priceSnapshots.map(mapDbPriceSnapshot),
    marketRisks: row.marketRisks.map(mapDbMarketRisk)
  };
}
