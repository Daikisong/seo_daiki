export interface Variant {
  id: string;
  productId: string;
  sourceSku?: string;
  optionName: string;
  wattageClaim?: number;
  plugType?: string;
  cableIncluded?: boolean;
  sourceUrl: string;
  affiliateUrl?: string;
  sellerName?: string;
  sellerId?: string;
  riskFlags?: string[];
}
