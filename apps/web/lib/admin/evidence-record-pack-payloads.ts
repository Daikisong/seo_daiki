import { optional, parseJson, required, requiredLocale } from "./evidence-record-form-values";

export function evidencePackMutationPayload(formData: FormData) {
  return {
    id: optional(formData, "id"),
    productId: optional(formData, "productId"),
    locale: requiredLocale(formData),
    packJson: parseJson(required(formData, "packJson"))
  };
}
