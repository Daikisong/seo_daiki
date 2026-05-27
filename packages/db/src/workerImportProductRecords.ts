import { toJson } from "./workerImportJson";
import { parseCableIncluded, parsePlugType, parseWattage } from "./workerImportProductParsing";
import type { ProductImportContext } from "./workerImportTypes";
import { numberValue, stringValue } from "./workerImportValueParsing";

export function productUpsertData(context: ProductImportContext) {
  return {
    canonicalName: context.title,
    slug: context.slug,
    category: context.category,
    brandClaim: context.brandClaim,
    identityConfidence: context.identityConfidence
  };
}

export function variantCreateData(productId: string, product: Record<string, unknown>, variant: Record<string, unknown>) {
  const optionName = stringValue(variant.option) || stringValue(variant.optionName) || "Default option";
  return {
    productId,
    sourceSku: stringValue(variant.source_sku) || stringValue(variant.sourceSku) || undefined,
    optionName,
    wattageClaim: numberValue(variant.wattage_claim) ?? parseWattage(optionName),
    plugType: stringValue(variant.plug_type) || parsePlugType(optionName) || undefined,
    cableIncluded: parseCableIncluded(optionName),
    sourceUrl: stringValue(variant.source_url) || stringValue(product.source_url) || "https://example.com/source",
    affiliateUrl: stringValue(variant.affiliate_url) || stringValue(variant.affiliateUrl) || undefined,
    sellerName: stringValue(product.seller) || undefined,
    sellerId: stringValue(variant.seller_id) || stringValue(variant.sellerId) || undefined,
    riskFlags: toJson(variant.risk_flags ?? [])
  };
}
