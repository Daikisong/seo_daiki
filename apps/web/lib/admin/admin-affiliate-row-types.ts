export type AffiliateMerchantRowSource = {
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
};

export type AffiliateOfferRowSource = {
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
};

export type AffiliatePlacementRowSource = {
  id: string;
  placementType: string;
  anchorText: string;
  status: string;
  rel: string;
  disclosureShown: boolean;
  article: { title: string; locale: string; type: string; slug: string };
  offer: { title: string; merchant: { slug: string } };
  _count: { affiliateClicks: number };
};
