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

export class AffiliateRedirectError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AffiliateRedirectError";
    this.status = status;
  }
}

export const affiliatePlacementStatuses = ["draft", "approved", "rejected", "disabled"] as const;
export type AffiliatePlacementStatus = (typeof affiliatePlacementStatuses)[number];
