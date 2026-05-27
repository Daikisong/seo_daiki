import type { AffiliateLink } from "@global-import-lab/types";
import { jsonArray, type JsonValue } from "./contentRepositoryJson";

export type ArticleAffiliatePlacementRow = {
  id: string;
  anchorText: string;
  rel: string;
  disclosureShown: boolean;
  status: string;
  offer: {
    affiliateUrl: string;
    status: string;
    healthSensitive: boolean;
    merchant: {
      slug: string;
      allowedDomains: unknown;
    };
  };
};

export function affiliateLinksFromJson(value: JsonValue, placements: ArticleAffiliatePlacementRow[]): AffiliateLink[] {
  const links = jsonArray<AffiliateLink>(value);
  if (placements.length === 0) {
    return links;
  }

  return links.map((link) => {
    const placement =
      (link.placementId ? placements.find((item) => item.id === link.placementId) : undefined) ??
      placements.find((item) => item.anchorText === link.label);

    if (!placement) {
      return link;
    }

    return {
      ...link,
      placementId: placement.id,
      placementStatus: placementStatus(placement.status),
      disclosureShown: placement.disclosureShown,
      offerStatus: offerStatus(placement.offer.status),
      merchantSlug: placement.offer.merchant.slug,
      merchantAllowedDomains: jsonArray<string>(placement.offer.merchant.allowedDomains),
      offerHealthSensitive: placement.offer.healthSensitive,
      rel: placement.rel,
      href: placement.offer.affiliateUrl
    };
  });
}

export function placementStatus(value: string): AffiliateLink["placementStatus"] {
  return value === "approved" || value === "disabled" || value === "rejected" || value === "draft" ? value : "draft";
}

export function offerStatus(value: string): AffiliateLink["offerStatus"] {
  return value === "active" || value === "inactive" || value === "expired" || value === "draft" ? value : "draft";
}
