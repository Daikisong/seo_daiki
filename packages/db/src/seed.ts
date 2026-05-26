import { prisma } from "./client";
import { articles, evidencePacks, products } from "@global-import-lab/content";
import type { Prisma } from "./generated/prisma/client";

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
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

    await prisma.variant.deleteMany({ where: { productId: product.id } });
    await prisma.sellerClaim.deleteMany({ where: { productId: product.id } });
    await prisma.verifiedClaim.deleteMany({ where: { productId: product.id } });
    await prisma.reviewSignal.deleteMany({ where: { productId: product.id } });
    await prisma.priceSnapshot.deleteMany({ where: { productId: product.id } });
    await prisma.marketRisk.deleteMany({ where: { productId: product.id } });

    for (const variant of product.variants) {
      await prisma.variant.create({
        data: {
          id: variant.id,
          productId: variant.productId,
          sourceSku: variant.sourceSku,
          optionName: variant.optionName,
          wattageClaim: variant.wattageClaim,
          plugType: variant.plugType,
          cableIncluded: variant.cableIncluded,
          sourceUrl: variant.sourceUrl,
          affiliateUrl: variant.affiliateUrl,
          sellerName: variant.sellerName,
          sellerId: variant.sellerId,
          riskFlags: toJson(variant.riskFlags ?? [])
        }
      });
    }

    for (const claim of product.sellerClaims) {
      await prisma.sellerClaim.create({ data: { ...claim, capturedAt: new Date(claim.capturedAt) } });
    }

    for (const claim of product.verifiedClaims) {
      await prisma.verifiedClaim.create({
        data: { ...claim, testedAt: claim.testedAt ? new Date(claim.testedAt) : undefined }
      });
    }

    for (const signal of product.reviewSignals) {
      await prisma.reviewSignal.create({ data: signal });
    }

    for (const snapshot of product.priceSnapshots) {
      await prisma.priceSnapshot.create({
        data: {
          ...snapshot,
          capturedAt: new Date(snapshot.capturedAt)
        }
      });
    }

    for (const risk of product.marketRisks) {
      await prisma.marketRisk.create({ data: risk });
    }
  }

  await prisma.evidencePack.deleteMany({});
  for (const pack of evidencePacks) {
    await prisma.evidencePack.create({
      data: {
        id: pack.id,
        productId: pack.productId,
        locale: pack.locale,
        packJson: toJson(pack.packJson),
        createdAt: new Date(pack.createdAt)
      }
    });
  }

  await prisma.article.deleteMany({});
  for (const article of articles) {
    await prisma.article.create({
      data: {
        id: article.id,
        productId: article.productId,
        locale: article.locale,
        slug: article.slug,
        type: article.type,
        title: article.title,
        h1: article.h1,
        metaDescription: article.metaDescription,
        summary: article.summary,
        contentMdx: article.contentMdx,
        sections: toJson(article.sections),
        internalLinks: toJson(article.internalLinks),
        affiliateLinks: toJson(article.affiliateLinks),
        evidenceIds: toJson(article.evidenceIds),
        jsonLd: toJson(article.jsonLd ?? {}),
        qualityScore: article.qualityScore,
        indexStatus: article.indexStatus,
        publishStatus: article.publishStatus,
        canonicalUrl: article.canonicalUrl,
        hreflangMap: toJson(article.hreflangMap),
        lastUpdated: new Date(article.lastUpdated)
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded sample products, evidence packs, and articles.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
