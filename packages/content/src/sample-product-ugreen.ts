import type { Product } from "@global-import-lab/types";
import type { SampleProductContext } from "./sample-product-context";
import { ugreenProductIdentity } from "./sample-product-ugreen-identity";
import { ugreenMarketRisks } from "./sample-product-ugreen-market-risks";
import { buildUgreenPriceSnapshots } from "./sample-product-ugreen-price-snapshots";
import { ugreenReviewSignals } from "./sample-product-ugreen-review-signals";
import { buildUgreenSellerClaims } from "./sample-product-ugreen-seller-claims";
import { ugreenVariants } from "./sample-product-ugreen-variants";
import { buildUgreenVerifiedClaims } from "./sample-product-ugreen-verified-claims";

export { ugreenProductIdentity } from "./sample-product-ugreen-identity";
export { ugreenMarketRisks } from "./sample-product-ugreen-market-risks";
export { buildUgreenPriceSnapshots } from "./sample-product-ugreen-price-snapshots";
export { ugreenReviewSignals } from "./sample-product-ugreen-review-signals";
export { buildUgreenSellerClaims } from "./sample-product-ugreen-seller-claims";
export { ugreenVariants } from "./sample-product-ugreen-variants";
export { buildUgreenVerifiedClaims } from "./sample-product-ugreen-verified-claims";

export function buildUgreenProduct({ updatedAt }: SampleProductContext): Product {
  return {
    ...ugreenProductIdentity,
    variants: ugreenVariants,
    sellerClaims: buildUgreenSellerClaims(updatedAt),
    verifiedClaims: buildUgreenVerifiedClaims(updatedAt),
    reviewSignals: ugreenReviewSignals,
    priceSnapshots: buildUgreenPriceSnapshots(updatedAt),
    marketRisks: ugreenMarketRisks
  };
}
