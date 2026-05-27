import type { AffiliatePlacementRowSource } from "./admin-affiliate-row-types";

export function affiliatePlacementRow(placement: AffiliatePlacementRowSource) {
  return {
    id: placement.id,
    placementType: placement.placementType,
    anchorText: placement.anchorText,
    status: placement.status,
    rel: placement.rel,
    disclosureShown: placement.disclosureShown,
    articleTitle: placement.article.title,
    articleLocale: placement.article.locale,
    articleType: placement.article.type,
    articleSlug: placement.article.slug,
    offerTitle: placement.offer.title,
    merchantSlug: placement.offer.merchant.slug,
    clickCount: placement._count.affiliateClicks
  };
}
