import type { Variant } from "@global-import-lab/types";
import { generatedProductBuildContext, type GeneratedProductBuildContext } from "./generated-product-fixture-context";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export function buildGeneratedProductVariants(
  spec: GeneratedProductSpec,
  context: GeneratedProductBuildContext = generatedProductBuildContext(spec)
): Variant[] {
  return [
    {
      id: context.primaryVariantId,
      productId: spec.id,
      sourceSku: `${spec.sourceSlug.toUpperCase()}-MAIN`,
      optionName: spec.optionName,
      wattageClaim: spec.wattageClaim,
      plugType: spec.plugType,
      cableIncluded: context.isCable || !spec.optionName.toLowerCase().includes("no cable"),
      sourceUrl: context.sourceUrl,
      affiliateUrl: context.affiliateUrl,
      sellerName: spec.sellerName,
      sellerId: context.sellerId,
      riskFlags: [`Use this SKU when citing the ${spec.claimValue} claim.`]
    },
    {
      id: context.trapVariantId,
      productId: spec.id,
      sourceSku: `${spec.sourceSlug.toUpperCase()}-TRAP`,
      optionName: spec.trapOptionName,
      wattageClaim: spec.trapWattageClaim,
      plugType: spec.plugType,
      cableIncluded: false,
      sourceUrl: context.sourceUrl,
      affiliateUrl: context.affiliateUrl,
      sellerName: spec.sellerName,
      sellerId: context.sellerId,
      riskFlags: [`Listing headline can be misread; ${spec.trapOptionName} does not support the main claim.`]
    }
  ];
}
