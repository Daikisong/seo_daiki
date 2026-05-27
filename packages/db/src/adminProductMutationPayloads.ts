import { toJson } from "./adminMutationRules";

export interface ProductMutationInput {
  id?: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim?: string;
  identityConfidence?: number;
  imageHash?: string;
}

export interface VariantMutationInput {
  id?: string;
  productId: string;
  optionName: string;
  sourceUrl: string;
  sourceSku?: string;
  wattageClaim?: number;
  plugType?: string;
  cableIncluded?: boolean;
  affiliateUrl?: string;
  sellerName?: string;
  sellerId?: string;
  riskFlags?: string[];
}

export function productMutationData(input: ProductMutationInput) {
  return {
    canonicalName: input.canonicalName,
    slug: input.slug,
    category: input.category,
    brandClaim: input.brandClaim,
    identityConfidence: input.identityConfidence ?? 0.7,
    imageHash: input.imageHash
  };
}

export function variantMutationData(input: VariantMutationInput) {
  return {
    productId: input.productId,
    optionName: input.optionName,
    sourceUrl: input.sourceUrl,
    sourceSku: input.sourceSku,
    wattageClaim: input.wattageClaim,
    plugType: input.plugType,
    cableIncluded: input.cableIncluded,
    affiliateUrl: input.affiliateUrl,
    sellerName: input.sellerName,
    sellerId: input.sellerId,
    riskFlags: toJson(input.riskFlags ?? [])
  };
}
