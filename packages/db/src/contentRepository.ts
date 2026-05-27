import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { prisma } from "./client";
import { mapDbArticle, mapDbEvidencePack, mapDbProduct } from "./contentRepositoryMappers";

export async function getDbArticles(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: { archivedAt: null },
    include: {
      affiliatePlacements: {
        include: {
          offer: {
            include: {
              merchant: true
            }
          }
        }
      }
    },
    orderBy: [{ locale: "asc" }, { type: "asc" }, { slug: "asc" }]
  });

  return rows.map(mapDbArticle);
}

export async function getDbProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { archivedAt: null },
    include: {
      variants: { where: { archivedAt: null } },
      sellerClaims: { where: { archivedAt: null } },
      verifiedClaims: { where: { archivedAt: null } },
      reviewSignals: true,
      priceSnapshots: true,
      marketRisks: { where: { archivedAt: null } }
    },
    orderBy: { canonicalName: "asc" }
  });

  return rows.map(mapDbProduct);
}

export async function getDbEvidencePacks(): Promise<EvidencePack[]> {
  const rows = await prisma.evidencePack.findMany({
    where: { archivedAt: null },
    orderBy: [{ locale: "asc" }, { createdAt: "desc" }]
  });

  return rows.map(mapDbEvidencePack);
}
