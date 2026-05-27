import { optional, optionalNumber, required, requiredLocale } from "./evidence-record-form-values";

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
