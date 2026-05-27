import { prisma } from "./client";
import {
  evidencePackMutationData,
  marketRiskMutationData,
  productMutationData,
  sellerClaimMutationData,
  variantMutationData,
  verifiedClaimMutationData,
  type EvidencePackMutationInput,
  type MarketRiskMutationInput,
  type ProductMutationInput,
  type SellerClaimMutationInput,
  type VariantMutationInput,
  type VerifiedClaimMutationInput
} from "./adminMutationPayloads";

export async function upsertProduct(input: ProductMutationInput) {
  const data = productMutationData(input);

  if (input.id) {
    return prisma.product.update({
      where: { id: input.id },
      data,
      select: { id: true, canonicalName: true, slug: true }
    });
  }

  return prisma.product.create({
    data,
    select: { id: true, canonicalName: true, slug: true }
  });
}

export async function upsertVariant(input: VariantMutationInput) {
  const data = variantMutationData(input);

  if (input.id) {
    return prisma.variant.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, optionName: true }
    });
  }

  return prisma.variant.create({
    data,
    select: { id: true, productId: true, optionName: true }
  });
}

export async function upsertSellerClaim(input: SellerClaimMutationInput) {
  const data = sellerClaimMutationData(input);

  if (input.id) {
    return prisma.sellerClaim.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, claimType: true, claimValue: true }
    });
  }

  return prisma.sellerClaim.create({
    data,
    select: { id: true, productId: true, claimType: true, claimValue: true }
  });
}

export async function upsertVerifiedClaim(input: VerifiedClaimMutationInput) {
  const data = verifiedClaimMutationData(input);

  if (input.id) {
    return prisma.verifiedClaim.update({
      where: { id: input.id },
      data,
      select: { id: true, productId: true, testType: true, resultValue: true }
    });
  }

  return prisma.verifiedClaim.create({
    data,
    select: { id: true, productId: true, testType: true, resultValue: true }
  });
}

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
