import {
  adminOperationAction,
  merchantAuditSummary,
  offerAuditSummary,
  toJson
} from "./operationsAdminModel";
import type { MerchantMutationInput, OfferMutationInput } from "./operationsAdminModel";

export function merchantUpsertAuditData(input: {
  mutation: MerchantMutationInput;
  after: { id: string; slug: string };
  before: unknown;
}) {
  return {
    entityType: "merchant",
    entityId: input.after.id,
    action: adminOperationAction(input.mutation),
    actor: "admin",
    summary: merchantAuditSummary(input.mutation, input.after.slug),
    beforeJson: input.before ? toJson(input.before) : undefined,
    afterJson: toJson(input.after)
  };
}

export function offerUpsertAuditData(input: {
  mutation: OfferMutationInput;
  after: { id: string; title: string };
  before: unknown;
}) {
  return {
    entityType: "offer",
    entityId: input.after.id,
    action: adminOperationAction(input.mutation),
    actor: "admin",
    summary: offerAuditSummary(input.mutation, input.after.title),
    beforeJson: input.before ? toJson(input.before) : undefined,
    afterJson: toJson(input.after)
  };
}
