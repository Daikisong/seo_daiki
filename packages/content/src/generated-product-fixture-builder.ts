import type { Product } from "@global-import-lab/types";
import { buildGeneratedSellerClaims, buildGeneratedVerifiedClaims } from "./generated-product-claims";
import { generatedProductBuildContext } from "./generated-product-fixture-context";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";
import { buildGeneratedMarketRisks } from "./generated-product-market-risks";
import { buildGeneratedPriceSnapshots } from "./generated-product-price-snapshots";
import { buildGeneratedReviewSignals } from "./generated-product-review-signals";
import { buildGeneratedProductVariants } from "./generated-product-variants";

export { buildGeneratedSellerClaims, buildGeneratedVerifiedClaims } from "./generated-product-claims";
export { generatedProductBuildContext } from "./generated-product-fixture-context";
export type { GeneratedProductBuildContext } from "./generated-product-fixture-context";
export { buildGeneratedMarketRisks, generatedProductLocaleRisk, generatedProductMarketLocales } from "./generated-product-market-risks";
export { buildGeneratedPriceSnapshots } from "./generated-product-price-snapshots";
export { buildGeneratedReviewSignals } from "./generated-product-review-signals";
export { buildGeneratedProductVariants } from "./generated-product-variants";

export function generatedSampleProduct(spec: GeneratedProductSpec, updatedAt: string): Product {
  const context = generatedProductBuildContext(spec);

  return {
    id: spec.id,
    canonicalName: spec.canonicalName,
    slug: spec.slug,
    category: spec.category,
    brandClaim: spec.brandClaim,
    identityConfidence: 0.74,
    imageHash: `pHash:${spec.sourceSlug}:generated`,
    variants: buildGeneratedProductVariants(spec, context),
    sellerClaims: buildGeneratedSellerClaims(spec, updatedAt, context),
    verifiedClaims: buildGeneratedVerifiedClaims(spec, updatedAt),
    reviewSignals: buildGeneratedReviewSignals(spec),
    priceSnapshots: buildGeneratedPriceSnapshots(spec, updatedAt, context),
    marketRisks: buildGeneratedMarketRisks(spec)
  };
}
