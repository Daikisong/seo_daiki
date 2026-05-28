import type { PriceSnapshot } from "@global-import-lab/types";
import { generatedProductBuildContext, type GeneratedProductBuildContext } from "./generated-product-fixture-context";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export function buildGeneratedPriceSnapshots(
  spec: GeneratedProductSpec,
  updatedAt: string,
  context: GeneratedProductBuildContext = generatedProductBuildContext(spec)
): PriceSnapshot[] {
  return [
    {
      id: `ps-${spec.sourceSlug}-us`,
      productId: spec.id,
      variantId: context.primaryVariantId,
      country: "US",
      currency: "USD",
      price: spec.price,
      shipping: spec.shipping,
      coupon: 0,
      finalPrice: Number((spec.price + spec.shipping).toFixed(2)),
      capturedAt: updatedAt
    }
  ];
}
