import type { AffiliateOfferRowSource } from "./admin-affiliate-row-types";

export function affiliateOfferRow(offer: AffiliateOfferRowSource) {
  return {
    id: offer.id,
    merchantId: offer.merchantId,
    programId: offer.programId,
    productId: offer.productId,
    topicId: offer.topicId,
    title: offer.title,
    description: offer.description,
    url: offer.url,
    affiliateUrl: offer.affiliateUrl,
    merchantSlug: offer.merchant.slug,
    locale: offer.locale,
    country: offer.country,
    category: offer.category,
    evidenceLevel: offer.evidenceLevel,
    healthSensitive: offer.healthSensitive,
    price: offer.price === null ? undefined : String(offer.price),
    currency: offer.currency,
    lastCheckedAt: offer.lastCheckedAt?.toISOString().slice(0, 10),
    status: offer.status,
    placementCount: offer._count.affiliatePlacements,
    clickCount: offer._count.affiliateClicks
  };
}
