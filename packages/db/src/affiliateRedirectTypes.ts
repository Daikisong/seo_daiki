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
