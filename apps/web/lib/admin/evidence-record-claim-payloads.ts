import { optional, optionalDate, optionalNumber, required } from "./evidence-record-form-values";

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
