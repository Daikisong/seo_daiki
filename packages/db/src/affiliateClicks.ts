import { prisma } from "./client";

export interface AffiliateClickInput {
  articleId?: string;
  placementId?: string;
  offerId?: string;
  merchantId?: string;
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

export class AffiliateRedirectError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AffiliateRedirectError";
    this.status = status;
  }
}

export async function resolveAffiliatePlacementRedirect(input: {
  placementId: string;
  referrer?: string;
  utm?: Record<string, string>;
}) {
  const placement = await prisma.affiliatePlacement.findUnique({
    where: { id: input.placementId },
    include: {
      article: { select: { id: true, locale: true, productId: true } },
      offer: { include: { merchant: true } }
    }
  });

  if (!placement) {
    throw new AffiliateRedirectError("Affiliate placement was not found.", 404);
  }
  if (placement.status !== "approved") {
    throw new AffiliateRedirectError("Affiliate placement is not approved.", 403);
  }
  if (!hasSponsoredNofollow(placement.rel)) {
    throw new AffiliateRedirectError("Affiliate placement rel must include sponsored and nofollow.", 403);
  }
  if (!placement.disclosureShown) {
    throw new AffiliateRedirectError("Affiliate placement must confirm disclosure before redirecting.", 403);
  }

  const { offer } = placement;
  const { merchant } = offer;

  if (offer.status !== "active") {
    throw new AffiliateRedirectError("Affiliate offer is not active.", 403);
  }
  if (!merchant.enabled) {
    throw new AffiliateRedirectError("Affiliate merchant is disabled.", 403);
  }
  if (!isAllowedMerchantUrl(offer.affiliateUrl, merchant.allowedDomains)) {
    throw new AffiliateRedirectError("Affiliate URL host is not allowed for this merchant.", 403);
  }

  await recordAffiliateClick({
    articleId: placement.articleId,
    placementId: placement.id,
    offerId: offer.id,
    merchantId: merchant.id,
    productId: offer.productId ?? placement.article.productId ?? undefined,
    locale: offer.locale ?? placement.article.locale ?? undefined,
    targetUrl: offer.affiliateUrl,
    referrer: input.referrer,
    utm: input.utm
  });

  return {
    targetUrl: offer.affiliateUrl,
    placementId: placement.id,
    offerId: offer.id,
    merchantId: merchant.id
  };
}

export async function listAffiliateMerchants() {
  return prisma.merchant.findMany({
    orderBy: { slug: "asc" },
    include: {
      _count: { select: { programs: true, offers: true, affiliateClicks: true } }
    }
  });
}

export async function listAffiliateOffers() {
  return prisma.offer.findMany({
    orderBy: [{ merchant: { slug: "asc" } }, { locale: "asc" }, { title: "asc" }],
    include: { merchant: true, _count: { select: { affiliatePlacements: true, affiliateClicks: true } } }
  });
}

export async function listAffiliatePlacements() {
  return prisma.affiliatePlacement.findMany({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      article: { select: { id: true, locale: true, slug: true, type: true, title: true } },
      offer: { include: { merchant: true } },
      _count: { select: { affiliateClicks: true } }
    }
  });
}

function hasSponsoredNofollow(rel: string) {
  const tokens = new Set(rel.split(/\s+/).filter(Boolean));
  return tokens.has("sponsored") && tokens.has("nofollow");
}

function isAllowedMerchantUrl(value: string, allowedDomains: unknown) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return allowedDomainList(allowedDomains).some((domain) => hostMatchesDomain(host, domain));
  } catch {
    return false;
  }
}

function allowedDomainList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim().toLowerCase()] : []));
}

function hostMatchesDomain(host: string, domain: string) {
  const normalized = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^\*\./, "")
    .toLowerCase();

  return host === normalized || host.endsWith(`.${normalized}`);
}
