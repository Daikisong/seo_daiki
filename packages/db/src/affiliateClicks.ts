import { prisma } from "./client";

export interface AffiliateClickInput {
  articleId?: string;
  productId?: string;
  variantId?: string;
  locale?: string;
  targetUrl: string;
  referrer?: string;
  utm?: Record<string, string>;
}

export async function recordAffiliateClick(input: AffiliateClickInput) {
  return prisma.affiliateClick.create({
    data: {
      articleId: input.articleId,
      productId: input.productId,
      variantId: input.variantId,
      locale: input.locale,
      targetUrl: input.targetUrl,
      referrer: input.referrer,
      utm: input.utm ?? {}
    }
  });
}
