import { prisma } from "./client";
import {
  sellerClaimMutationData,
  verifiedClaimMutationData,
  type SellerClaimMutationInput,
  type VerifiedClaimMutationInput
} from "./adminMutationPayloads";

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
