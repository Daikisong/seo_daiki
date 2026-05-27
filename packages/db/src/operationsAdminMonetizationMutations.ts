import { prisma } from "./client";
import {
  merchantUpsertAuditData,
  offerUpsertAuditData
} from "./operationsAdminAuditPayloads";
import {
  merchantMutationData,
  offerMutationData,
  type MerchantMutationInput,
  type OfferMutationInput
} from "./operationsAdminModel";

export async function upsertMerchant(input: MerchantMutationInput) {
  const data = merchantMutationData(input);

  return prisma.$transaction(async (tx) => {
    const before = input.id ? await tx.merchant.findUnique({ where: { id: input.id } }) : null;
    const after = input.id
      ? await tx.merchant.update({ where: { id: input.id }, data })
      : await tx.merchant.create({ data });
    await tx.auditLog.create({
      data: merchantUpsertAuditData({ mutation: input, before, after })
    });
    return after;
  });
}

export async function upsertOffer(input: OfferMutationInput) {
  const data = offerMutationData(input);

  return prisma.$transaction(async (tx) => {
    const before = input.id ? await tx.offer.findUnique({ where: { id: input.id } }) : null;
    const after = input.id
      ? await tx.offer.update({ where: { id: input.id }, data })
      : await tx.offer.create({ data });
    await tx.auditLog.create({
      data: offerUpsertAuditData({ mutation: input, before, after })
    });
    return after;
  });
}
