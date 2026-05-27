import { articles, products } from "@global-import-lab/content";
import type { AffiliateLink, Article, Product } from "@global-import-lab/types";
import {
  affiliateLinksWithPlacementIds,
  affiliateOfferId,
  aliexpressAffiliateUrl,
  countryForLocale,
  iherbAffiliateUrl,
  isIherbSeedAffiliateLink
} from "./seedAffiliateModel";
import type { SeedAffiliateMerchants } from "./seedAffiliateMerchantRecords";
import type { SeedDbClient } from "./seedTypes";

export function seedAffiliateOfferCreateData(input: {
  article: Pick<Article, "id" | "lastUpdated" | "locale" | "productId" | "slug" | "title">;
  index: number;
  link: AffiliateLink;
  merchant: { healthSensitive: boolean; id: string };
  product?: Pick<Product, "category">;
  program: { id: string };
  isIherb: boolean;
}) {
  const offerId = affiliateOfferId(input.article.id, input.index);
  const affiliateUrl = input.isIherb
    ? iherbAffiliateUrl(input.article, input.index)
    : aliexpressAffiliateUrl(input.article, input.index);

  return {
    id: offerId,
    merchantId: input.merchant.id,
    programId: input.program.id,
    productId: input.article.productId,
    title: input.link.label,
    description: `Seeded affiliate offer for ${input.article.title}.`,
    url: affiliateUrl,
    affiliateUrl,
    locale: input.article.locale,
    country: countryForLocale(input.article.locale),
    category: input.product?.category ?? "general",
    evidenceLevel: "merchant_claim",
    healthSensitive: input.merchant.healthSensitive,
    status: "active",
    lastCheckedAt: new Date(input.article.lastUpdated)
  };
}

export function seedAffiliatePlacementCreateData(input: {
  article: Pick<Article, "id" | "indexStatus" | "publishStatus">;
  link: AffiliateLink & { placementId: string };
  offerId: string;
}) {
  return {
    id: input.link.placementId,
    articleId: input.article.id,
    offerId: input.offerId,
    placementType: "cta",
    anchorText: input.link.label,
    rel: input.link.rel,
    disclosureShown: true,
    status: input.article.publishStatus === "published" && input.article.indexStatus === "index" ? "approved" : "draft"
  };
}

export async function seedAffiliateOffersAndPlacements(db: SeedDbClient, seed: SeedAffiliateMerchants) {
  const productById = new Map(products.map((product) => [product.id, product]));

  for (const article of articles) {
    const affiliateLinks = affiliateLinksWithPlacementIds(article);
    for (const [index, link] of affiliateLinks.entries()) {
      if (!link.placementId) {
        continue;
      }

      const isIherb = isIherbSeedAffiliateLink(link);
      const merchant = isIherb ? seed.iherb : seed.aliexpress;
      const program = isIherb ? seed.iherbProgram : seed.aliexpressProgram;
      const product = article.productId ? productById.get(article.productId) : undefined;
      const offerData = seedAffiliateOfferCreateData({ article, index, link, merchant, product, program, isIherb });

      await db.offer.create({ data: offerData });
      await db.affiliatePlacement.create({
        data: seedAffiliatePlacementCreateData({ article, link: { ...link, placementId: link.placementId }, offerId: offerData.id })
      });
    }
  }
}
