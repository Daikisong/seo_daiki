import { prisma } from "./client";
import { articles, evidencePacks, products } from "@global-import-lab/content";
import type { AffiliateLink, Article } from "@global-import-lab/types";
import type { Prisma } from "./generated/prisma/client";

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

async function main() {
  await prisma.affiliatePlacement.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.affiliateProgram.deleteMany({});
  await prisma.merchant.deleteMany({});

  const affiliateSeed = await seedAffiliateMerchants();

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
    const affiliateLinks = affiliateLinksWithPlacementIds(article);
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
        affiliateLinks: toJson(affiliateLinks),
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

  await seedAffiliateOffersAndPlacements(affiliateSeed);
}

async function seedAffiliateMerchants() {
  const aliexpress = await prisma.merchant.create({
    data: {
      id: "merchant-aliexpress",
      name: "AliExpress",
      slug: "aliexpress",
      domain: "aliexpress.com",
      merchantType: "marketplace",
      allowedDomains: toJson(
        domainListFromEnv("ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS", [
          "aliexpress.com",
          "www.aliexpress.com",
          "s.click.aliexpress.com",
          "best.aliexpress.com"
        ])
      ),
      healthSensitive: false
    }
  });

  const aliexpressProgram = await prisma.affiliateProgram.create({
    data: {
      id: "program-aliexpress-default",
      merchantId: aliexpress.id,
      network: process.env.ALIEXPRESS_AFFILIATE_NETWORK ?? "inhouse",
      trackingId: process.env.ALIEXPRESS_TRACKING_ID,
      termsNote: "Seeded default program for AliExpress marketplace offers."
    }
  });

  const iherb = await prisma.merchant.create({
    data: {
      id: "merchant-iherb",
      name: "iHerb",
      slug: "iherb",
      domain: "iherb.com",
      merchantType: "supplement_store",
      allowedDomains: toJson(domainListFromEnv("IHERB_ALLOWED_AFFILIATE_DOMAINS", ["iherb.com", "www.iherb.com"])),
      healthSensitive: true
    }
  });

  const iherbProgram = await prisma.affiliateProgram.create({
    data: {
      id: "program-iherb-default",
      merchantId: iherb.id,
      network: process.env.IHERB_AFFILIATE_NETWORK ?? "inhouse",
      trackingId: process.env.IHERB_TRACKING_ID,
      termsNote: "Seeded default program for iHerb supplement-store offers; health pages still require compliance review."
    }
  });

  return {
    aliexpress,
    aliexpressProgram,
    iherb,
    iherbProgram
  };
}

async function seedAffiliateOffersAndPlacements(seed: Awaited<ReturnType<typeof seedAffiliateMerchants>>) {
  const productById = new Map(products.map((product) => [product.id, product]));

  for (const article of articles) {
    const affiliateLinks = affiliateLinksWithPlacementIds(article);
    for (const [index, link] of affiliateLinks.entries()) {
      if (!link.placementId) {
        continue;
      }

      const isIherb = /iherb|supplement|vitamin|probiotic|magnesium/i.test(`${link.label} ${link.href}`);
      const merchant = isIherb ? seed.iherb : seed.aliexpress;
      const program = isIherb ? seed.iherbProgram : seed.aliexpressProgram;
      const product = article.productId ? productById.get(article.productId) : undefined;
      const offerId = affiliateOfferId(article.id, index);
      const affiliateUrl = isIherb ? iherbAffiliateUrl(article, index) : aliexpressAffiliateUrl(article, index);

      await prisma.offer.create({
        data: {
          id: offerId,
          merchantId: merchant.id,
          programId: program.id,
          productId: article.productId,
          title: link.label,
          description: `Seeded affiliate offer for ${article.title}.`,
          url: affiliateUrl,
          affiliateUrl,
          locale: article.locale,
          country: countryForLocale(article.locale),
          category: product?.category ?? "general",
          evidenceLevel: "merchant_claim",
          healthSensitive: merchant.healthSensitive,
          status: "active",
          lastCheckedAt: new Date(article.lastUpdated)
        }
      });

      await prisma.affiliatePlacement.create({
        data: {
          id: link.placementId,
          articleId: article.id,
          offerId,
          placementType: "cta",
          anchorText: link.label,
          rel: link.rel,
          disclosureShown: true,
          status: article.publishStatus === "published" && article.indexStatus === "index" ? "approved" : "draft"
        }
      });
    }
  }
}

function affiliateLinksWithPlacementIds(article: Article): AffiliateLink[] {
  return article.affiliateLinks.map((link, index) => ({
    ...link,
    placementId: link.placementId ?? affiliatePlacementId(article.id, index)
  }));
}

function affiliatePlacementId(articleId: string, index: number) {
  return `placement-${articleId}-${index + 1}`;
}

function affiliateOfferId(articleId: string, index: number) {
  return `offer-${articleId}-${index + 1}`;
}

function aliexpressAffiliateUrl(article: Article, index: number) {
  const itemKey = encodeURIComponent(article.productId ?? `${article.slug}-${index + 1}`);
  return `https://www.aliexpress.com/item/${itemKey}.html`;
}

function iherbAffiliateUrl(article: Article, index: number) {
  const itemKey = encodeURIComponent(`${article.slug}-${index + 1}`);
  return `https://www.iherb.com/pr/${itemKey}`;
}

function countryForLocale(locale: string) {
  if (locale === "pt-br") {
    return "BR";
  }
  if (locale === "es") {
    return "ES";
  }
  return "US";
}

function domainListFromEnv(name: string, fallback: string[]) {
  return (process.env[name]?.split(",").map((item) => item.trim()).filter(Boolean) ?? fallback).map((domain) =>
    domain.toLowerCase()
  );
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
