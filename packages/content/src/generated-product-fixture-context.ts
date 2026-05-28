import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export interface GeneratedProductBuildContext {
  sourceUrl: string;
  affiliateUrl: string;
  primaryVariantId: string;
  trapVariantId: string;
  sellerId: string;
  isCable: boolean;
}

export function generatedProductBuildContext(spec: GeneratedProductSpec): GeneratedProductBuildContext {
  return {
    sourceUrl: `https://example.com/source/${spec.sourceSlug}`,
    affiliateUrl: `https://example.com/go/${spec.sourceSlug}`,
    primaryVariantId: `var-${spec.sourceSlug}-primary`,
    trapVariantId: `var-${spec.sourceSlug}-trap`,
    sellerId: `seller-${spec.sourceSlug}`,
    isCable: spec.category.includes("cable")
  };
}
