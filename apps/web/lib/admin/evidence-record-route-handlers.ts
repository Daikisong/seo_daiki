import { optional } from "./evidence-record-form-values";
import {
  evidencePackMutationPayload,
  marketRiskMutationPayload,
  productMutationPayload,
  sellerClaimMutationPayload,
  variantMutationPayload,
  verifiedClaimMutationPayload
} from "./evidence-record-route-payloads";

export type AdminMutations = typeof import("@global-import-lab/db/admin-mutations");
export type EvidenceRecordMutationAction = "create" | "update";
export type EvidenceRecordMutationHandler = (formData: FormData, mutations: AdminMutations) => Promise<string>;

export function evidenceRecordMutationAction(formData: FormData): EvidenceRecordMutationAction {
  return optional(formData, "id") ? "update" : "create";
}

export const evidenceRecordMutationHandlers: Record<string, EvidenceRecordMutationHandler> = {
  product: async (formData, mutations) => (await mutations.upsertProduct(productMutationPayload(formData))).id,
  variant: async (formData, mutations) => (await mutations.upsertVariant(variantMutationPayload(formData))).id,
  "seller-claim": async (formData, mutations) =>
    (await mutations.upsertSellerClaim(sellerClaimMutationPayload(formData))).id,
  "verified-claim": async (formData, mutations) =>
    (await mutations.upsertVerifiedClaim(verifiedClaimMutationPayload(formData))).id,
  "market-risk": async (formData, mutations) => (await mutations.upsertMarketRisk(marketRiskMutationPayload(formData))).id,
  "evidence-pack": async (formData, mutations) =>
    (await mutations.upsertEvidencePack(evidencePackMutationPayload(formData))).id
};

export function evidenceRecordMutationHandler(recordType: string) {
  const handler = evidenceRecordMutationHandlers[recordType];
  if (!handler) {
    throw new Error(`Unsupported recordType: ${recordType}`);
  }
  return handler;
}
