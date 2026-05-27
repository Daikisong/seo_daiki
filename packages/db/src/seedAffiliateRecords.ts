import { articles, products } from "@global-import-lab/content";
import {
  affiliateLinksWithPlacementIds,
  affiliateOfferId,
  aliexpressAffiliateUrl,
  countryForLocale,
  defaultAliExpressAllowedDomains,
  defaultIherbAllowedDomains,
  domainListFromEnv,
  iherbAffiliateUrl,
  isIherbSeedAffiliateLink
} from "./seedAffiliateModel";
import type { SeedDbClient } from "./seedTypes";
import { toSeedJson } from "./seedTypes";

export type SeedAffiliateMerchants = Awaited<ReturnType<typeof seedAffiliateMerchants>>;

export async function seedAffiliateMerchants(db: SeedDbClient) {
  const aliexpress = await db.merchant.create({
    data: {
      id: "merchant-aliexpress",
      name: "AliExpress",
      slug: "aliexpress",
      domain: "aliexpress.com",
      merchantType: "marketplace",
      allowedDomains: toSeedJson(
        domainListFromEnv("ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS", defaultAliExpressAllowedDomains)
      ),
      healthSensitive: false
    }
  });

  const aliexpressProgram = await db.affiliateProgram.create({
    data: {
      id: "program-aliexpress-default",
      merchantId: aliexpress.id,
      network: process.env.ALIEXPRESS_AFFILIATE_NETWORK ?? "inhouse",
      trackingId: process.env.ALIEXPRESS_TRACKING_ID,
      termsNote: "Seeded default program for AliExpress marketplace offers."
    }
  });

  const iherb = await db.merchant.create({
    data: {
      id: "merchant-iherb",
      name: "iHerb",
      slug: "iherb",
      domain: "iherb.com",
      merchantType: "supplement_store",
      allowedDomains: toSeedJson(domainListFromEnv("IHERB_ALLOWED_AFFILIATE_DOMAINS", defaultIherbAllowedDomains)),
      healthSensitive: true
    }
  });

  const iherbProgram = await db.affiliateProgram.create({
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
      const offerId = affiliateOfferId(article.id, index);
      const affiliateUrl = isIherb ? iherbAffiliateUrl(article, index) : aliexpressAffiliateUrl(article, index);

      await db.offer.create({
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

      await db.affiliatePlacement.create({
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
