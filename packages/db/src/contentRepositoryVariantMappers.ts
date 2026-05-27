import type { Variant } from "@global-import-lab/types";
import { jsonArray } from "./contentRepositoryJson";
import type { DbVariantRow } from "./contentRepositoryProductRows";

export function mapDbVariant(variant: DbVariantRow): Variant {
  return {
    id: variant.id,
    productId: variant.productId,
    sourceSku: variant.sourceSku ?? undefined,
    optionName: variant.optionName,
    wattageClaim: variant.wattageClaim ?? undefined,
    plugType: variant.plugType ?? undefined,
    cableIncluded: variant.cableIncluded ?? undefined,
    sourceUrl: variant.sourceUrl,
    affiliateUrl: variant.affiliateUrl ?? undefined,
    sellerName: variant.sellerName ?? undefined,
    sellerId: variant.sellerId ?? undefined,
    riskFlags: jsonArray<string>(variant.riskFlags)
  };
}
