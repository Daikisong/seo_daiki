import {
  listValue,
  optional,
  optionalBoolean,
  optionalDate,
  optionalInteger,
  optionalNumber,
  parseJson,
  required,
  requiredLocale
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

export function sellerClaimMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    productId: required(formData, "productId"),
    claimType: required(formData, "claimType"),
    claimValue: required(formData, "claimValue"),
    rawText: optional(formData, "rawText"),
    sourceUrl: optional(formData, "sourceUrl"),
    confidence: optionalNumber(formData, "confidence")
  };
}

export function verifiedClaimMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    productId: required(formData, "productId"),
    testType: required(formData, "testType"),
    resultValue: required(formData, "resultValue"),
    unit: optional(formData, "unit"),
    method: required(formData, "method"),
    evidenceUrl: optional(formData, "evidenceUrl"),
    confidence: optionalNumber(formData, "confidence"),
    testedAt: optionalDate(formData, "testedAt")
  };
}

export function marketRiskMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    productId: required(formData, "productId"),
    locale: requiredLocale(formData),
    country: optional(formData, "country"),
    plugRisk: optional(formData, "plugRisk"),
    customsRisk: optional(formData, "customsRisk"),
    certificationRisk: optional(formData, "certificationRisk"),
    returnRisk: optional(formData, "returnRisk"),
    localAlternativeNote: optional(formData, "localAlternativeNote"),
    score: optionalNumber(formData, "score")
  };
}

export function evidencePackMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    productId: optional(formData, "productId"),
    locale: requiredLocale(formData),
    packJson: parseJson(required(formData, "packJson"))
  };
}
