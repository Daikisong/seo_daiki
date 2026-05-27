import type {
  AffiliatePlacementPolicy,
  AffiliateRedirectTracking
} from "./affiliateRedirectTypes";

export function affiliateClickInputFromPlacement(
  placement: Required<Pick<AffiliatePlacementPolicy, "id" | "articleId">> & AffiliatePlacementPolicy,
  tracking: AffiliateRedirectTracking = {}
) {
  const { offer } = placement;
  const { merchant } = offer;
  return {
    articleId: placement.articleId,
    placementId: placement.id,
    offerId: offer.id,
    merchantId: merchant.id,
    productId: offer.productId ?? placement.article?.productId ?? undefined,
    locale: offer.locale ?? placement.article?.locale ?? undefined,
    targetUrl: offer.affiliateUrl,
    referrer: tracking.referrer,
    utm: tracking.utm
  };
}
