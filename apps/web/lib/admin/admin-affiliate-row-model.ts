import { stringArrayFromUnknown } from "./admin-section-utils";

export function affiliateMerchantRow(merchant: {
  id: string;
  name: string;
  slug: string;
  domain: string;
  merchantType: string;
  allowedDomains: unknown;
  defaultRel: string;
  healthSensitive: boolean;
  enabled: boolean;
  _count: { offers: number; affiliateClicks: number };
}) {
  return {
    id: merchant.id,
    name: merchant.name,
    slug: merchant.slug,
    domain: merchant.domain,
    merchantType: merchant.merchantType,
    allowedDomains: stringArrayFromUnknown(merchant.allowedDomains),
    defaultRel: merchant.defaultRel,
    healthSensitive: merchant.healthSensitive,
    enabled: merchant.enabled,
    offerCount: merchant._count.offers,
    clickCount: merchant._count.affiliateClicks
  };
}

export function affiliateOfferRow(offer: {
  id: string;
  merchantId: string;
  programId: string | null;
  productId: string | null;
  topicId: string | null;
  title: string;
  description: string | null;
  url: string;
  affiliateUrl: string;
  merchant: { slug: string };
  locale: string | null;
  country: string | null;
  category: string;
  evidenceLevel: string;
  healthSensitive: boolean;
  price: unknown | null;
  currency: string | null;
  lastCheckedAt: Date | null;
  status: string;
  _count: { affiliatePlacements: number; affiliateClicks: number };
}) {
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

export function affiliatePlacementRow(placement: {
  id: string;
  placementType: string;
  anchorText: string;
  status: string;
  rel: string;
  disclosureShown: boolean;
  article: { title: string; locale: string; type: string; slug: string };
  offer: { title: string; merchant: { slug: string } };
  _count: { affiliateClicks: number };
}) {
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
