export interface RedirectBlocker {
  message: string;
  status: number;
}

export interface AffiliateMerchantPolicy {
  id?: string;
  enabled: boolean;
  allowedDomains: unknown;
}

export interface AffiliateOfferPolicy {
  id?: string;
  productId?: string | null;
  locale?: string | null;
  status: string;
  affiliateUrl: string;
  merchant: AffiliateMerchantPolicy;
}

export interface AffiliatePlacementPolicy {
  id?: string;
  articleId?: string;
  status: string;
  rel: string;
  disclosureShown: boolean;
  article?: { productId?: string | null; locale?: string | null };
  offer: AffiliateOfferPolicy;
}

export interface AffiliateRedirectTracking {
  referrer?: string;
  utm?: Record<string, string>;
}

export function affiliateRedirectBlocker(placement: AffiliatePlacementPolicy): RedirectBlocker | undefined {
  if (placement.status !== "approved") {
    return { message: "Affiliate placement is not approved.", status: 403 };
  }
  if (!hasSponsoredNofollow(placement.rel)) {
    return { message: "Affiliate placement rel must include sponsored and nofollow.", status: 403 };
  }
  if (!placement.disclosureShown) {
    return { message: "Affiliate placement must confirm disclosure before redirecting.", status: 403 };
  }

  return affiliateOfferPolicyBlocker(placement.offer, 403);
}

export function affiliatePlacementApprovalBlocker(
  placement: AffiliatePlacementPolicy,
  nextDisclosureShown = placement.disclosureShown
): RedirectBlocker | undefined {
  if (!hasSponsoredNofollow(placement.rel)) {
    return { message: "Affiliate placement rel must include sponsored and nofollow before approval.", status: 400 };
  }
  if (!nextDisclosureShown) {
    return { message: "Affiliate placement disclosure must be confirmed before approval.", status: 400 };
  }

  return affiliateOfferPolicyBlocker(placement.offer, 400, "before placement approval");
}

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

export function hasSponsoredNofollow(rel: string) {
  const tokens = new Set(rel.split(/\s+/).filter(Boolean));
  return tokens.has("sponsored") && tokens.has("nofollow");
}

export function isAllowedMerchantUrl(value: string, allowedDomains: unknown) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return allowedDomainList(allowedDomains).some((domain) => hostMatchesDomain(host, domain));
  } catch {
    return false;
  }
}

export function allowedDomainList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim().toLowerCase()] : []));
}

export function hostMatchesDomain(host: string, domain: string) {
  const normalized = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^\*\./, "")
    .toLowerCase();

  return host === normalized || host.endsWith(`.${normalized}`);
}

function affiliateOfferPolicyBlocker(
  offer: AffiliateOfferPolicy,
  status: number,
  suffix?: "before placement approval"
): RedirectBlocker | undefined {
  if (offer.status !== "active") {
    return {
      message: suffix ? `Affiliate offer must be active ${suffix}.` : "Affiliate offer is not active.",
      status
    };
  }
  if (!offer.merchant.enabled) {
    return {
      message: suffix ? `Affiliate merchant must be enabled ${suffix}.` : "Affiliate merchant is disabled.",
      status
    };
  }
  if (!isAllowedMerchantUrl(offer.affiliateUrl, offer.merchant.allowedDomains)) {
    return {
      message: "Affiliate URL host is not allowed for this merchant.",
      status
    };
  }
  return undefined;
}
