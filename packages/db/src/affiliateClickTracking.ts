import { prisma } from "./client";
import type { AffiliateClickInput } from "./affiliateClickTypes";

export async function recordAffiliateClick(input: AffiliateClickInput) {
  return prisma.affiliateClick.create({
    data: {
      articleId: input.articleId,
      placementId: input.placementId,
      offerId: input.offerId,
      merchantId: input.merchantId,
      productId: input.productId,
      variantId: input.variantId,
      locale: input.locale,
      targetUrl: input.targetUrl,
      referrer: input.referrer,
      utm: input.utm ?? {}
    }
  });
}
