import { prisma } from "./client";
import {
  productMutationData,
  variantMutationData,
  type ProductMutationInput,
  type VariantMutationInput
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
