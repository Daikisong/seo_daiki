import { products } from "@global-import-lab/content";
import type { Product } from "@global-import-lab/types";
import { createProductChildren, deleteProductChildren } from "./seedProductChildren";
import type { SeedDbClient } from "./seedTypes";

export async function seedProducts(db: SeedDbClient, seedProducts: Product[] = products) {
  for (const product of seedProducts) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {
        canonicalName: product.canonicalName,
        category: product.category,
        brandClaim: product.brandClaim,
        identityConfidence: product.identityConfidence,
        imageHash: product.imageHash
      },
      create: {
        id: product.id,
        canonicalName: product.canonicalName,
        slug: product.slug,
        category: product.category,
        brandClaim: product.brandClaim,
        identityConfidence: product.identityConfidence,
        imageHash: product.imageHash
      }
    });

    await deleteProductChildren(db, product.id);
    await createProductChildren(db, product);
  }
}
