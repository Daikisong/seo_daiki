import { prisma } from "./client";
import {
  evidencePackMutationData,
  marketRiskMutationData,
  type EvidencePackMutationInput,
  type MarketRiskMutationInput
} from "./adminMutationPayloads";

export async function upsertMarketRisk(input: MarketRiskMutationInput) {
  const data = marketRiskMutationData(input);

  if (input.id) {
    return prisma.marketRisk.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, locale: true, country: true }
    });
  }

  return prisma.marketRisk.create({
    data,
    select: { id: true, productId: true, locale: true, country: true }
  });
}

export async function upsertEvidencePack(input: EvidencePackMutationInput) {
  const data = evidencePackMutationData(input);

  if (input.id) {
    return prisma.evidencePack.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, locale: true }
    });
  }

  return prisma.evidencePack.create({
    data,
    select: { id: true, productId: true, locale: true }
  });
}
