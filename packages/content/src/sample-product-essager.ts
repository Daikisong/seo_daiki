import type { Product } from "@global-import-lab/types";
import type { SampleProductContext } from "./sample-product-context";
import { essagerCableProductIdentity } from "./sample-product-essager-identity";
import { essagerCableMarketRisks } from "./sample-product-essager-market-risks";
import { buildEssagerCablePriceSnapshots } from "./sample-product-essager-price-snapshots";
import { essagerCableReviewSignals } from "./sample-product-essager-review-signals";
import { buildEssagerCableSellerClaims } from "./sample-product-essager-seller-claims";
import { essagerCableVariants } from "./sample-product-essager-variants";
import { buildEssagerCableVerifiedClaims } from "./sample-product-essager-verified-claims";

export { essagerCableProductIdentity } from "./sample-product-essager-identity";
export { essagerCableMarketRisks } from "./sample-product-essager-market-risks";
export { buildEssagerCablePriceSnapshots } from "./sample-product-essager-price-snapshots";
export { essagerCableReviewSignals } from "./sample-product-essager-review-signals";
export { buildEssagerCableSellerClaims } from "./sample-product-essager-seller-claims";
export { essagerCableVariants } from "./sample-product-essager-variants";
export { buildEssagerCableVerifiedClaims } from "./sample-product-essager-verified-claims";

export function buildEssagerCableProduct({ updatedAt }: SampleProductContext): Product {
  return {
    ...essagerCableProductIdentity,
    variants: essagerCableVariants,
    sellerClaims: buildEssagerCableSellerClaims(updatedAt),
    verifiedClaims: buildEssagerCableVerifiedClaims(updatedAt),
    reviewSignals: essagerCableReviewSignals,
    priceSnapshots: buildEssagerCablePriceSnapshots(updatedAt),
    marketRisks: essagerCableMarketRisks
  };
}
