import type { Product } from "@global-import-lab/types";
import type { SampleProductContext } from "./sample-product-context";
import { baseusProductIdentity } from "./sample-product-baseus-identity";
import { baseusMarketRisks } from "./sample-product-baseus-market-risks";
import { buildBaseusPriceSnapshots } from "./sample-product-baseus-price-snapshots";
import { baseusReviewSignals } from "./sample-product-baseus-review-signals";
import { buildBaseusSellerClaims } from "./sample-product-baseus-seller-claims";
import { baseusVariants } from "./sample-product-baseus-variants";
import { buildBaseusVerifiedClaims } from "./sample-product-baseus-verified-claims";

export { baseusProductIdentity } from "./sample-product-baseus-identity";
export { baseusMarketRisks } from "./sample-product-baseus-market-risks";
export { buildBaseusPriceSnapshots } from "./sample-product-baseus-price-snapshots";
export { baseusReviewSignals } from "./sample-product-baseus-review-signals";
export { buildBaseusSellerClaims } from "./sample-product-baseus-seller-claims";
export { baseusVariants } from "./sample-product-baseus-variants";
export { buildBaseusVerifiedClaims } from "./sample-product-baseus-verified-claims";

export function buildBaseusProduct({ updatedAt }: SampleProductContext): Product {
  return {
    ...baseusProductIdentity,
    variants: baseusVariants,
    sellerClaims: buildBaseusSellerClaims(updatedAt),
    verifiedClaims: buildBaseusVerifiedClaims(updatedAt),
    reviewSignals: baseusReviewSignals,
    priceSnapshots: buildBaseusPriceSnapshots(updatedAt),
    marketRisks: baseusMarketRisks
  };
}
