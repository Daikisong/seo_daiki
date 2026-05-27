import { toJson } from "./adminMutationRules";

export interface EvidencePackMutationInput {
  id?: string;
  productId?: string;
  locale: string;
  packJson: unknown;
}

export function evidencePackMutationData(input: EvidencePackMutationInput) {
  return {
    productId: input.productId,
    locale: input.locale,
    packJson: toJson(input.packJson)
  };
}
