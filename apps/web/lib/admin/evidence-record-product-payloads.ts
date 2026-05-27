import {
  listValue,
  optional,
  optionalBoolean,
  optionalInteger,
  optionalNumber,
  required
} from "./evidence-record-form-values";

export function productMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    canonicalName: required(formData, "canonicalName"),
    slug: required(formData, "slug"),
    category: required(formData, "category"),
    brandClaim: optional(formData, "brandClaim"),
    identityConfidence: optionalNumber(formData, "identityConfidence"),
    imageHash: optional(formData, "imageHash")
  };
}

export function variantMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    productId: required(formData, "productId"),
    optionName: required(formData, "optionName"),
    sourceUrl: required(formData, "sourceUrl"),
    sourceSku: optional(formData, "sourceSku"),
    wattageClaim: optionalInteger(formData, "wattageClaim"),
    plugType: optional(formData, "plugType"),
    cableIncluded: optionalBoolean(formData, "cableIncluded"),
    affiliateUrl: optional(formData, "affiliateUrl"),
    sellerName: optional(formData, "sellerName"),
    sellerId: optional(formData, "sellerId"),
    riskFlags: listValue(formData, "riskFlags")
  };
}
