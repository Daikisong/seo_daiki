import type { Locale } from "./locales";

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

export interface SellerClaim {
  id: string;
  productId: string;
  claimType: string;
  claimValue: string;
  rawText?: string;
  sourceUrl?: string;
  capturedAt: string;
  confidence: number;
}

export interface VerifiedClaim {
  id: string;
  productId: string;
  testType: string;
  resultValue: string;
  unit?: string;
  method: string;
  evidenceUrl?: string;
  confidence: number;
  testedAt?: string;
}

export interface ReviewSignal {
  id: string;
  productId: string;
  locale: Locale;
  topic: string;
  sentiment: "positive" | "neutral" | "negative";
  count: number;
  confidence: number;
  window?: string;
}

export interface PriceSnapshot {
  id: string;
  productId: string;
  variantId?: string;
  country?: string;
  currency: string;
  price: number;
  shipping?: number;
  coupon?: number;
  finalPrice?: number;
  capturedAt: string;
}

export interface MarketRisk {
  id: string;
  productId: string;
  locale: Locale;
  country?: string;
  plugRisk?: string;
  customsRisk?: string;
  certificationRisk?: string;
  returnRisk?: string;
  localAlternativeNote?: string;
  score: number;
}

export interface Product {
  id: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim?: string;
  identityConfidence: number;
  imageHash?: string;
  variants: Variant[];
  sellerClaims: SellerClaim[];
  verifiedClaims: VerifiedClaim[];
  reviewSignals: ReviewSignal[];
  priceSnapshots: PriceSnapshot[];
  marketRisks: MarketRisk[];
}

export interface EvidencePack {
  id: string;
  productId?: string;
  locale: Locale;
  packJson: {
    product?: Pick<Product, "id" | "canonicalName" | "slug" | "category">;
    variants: Variant[];
    sellerClaims: SellerClaim[];
    verifiedClaims: VerifiedClaim[];
    reviewSignals: ReviewSignal[];
    priceSnapshots: PriceSnapshot[];
    marketRisks: MarketRisk[];
    allowedClaims: string[];
    forbiddenClaims: string[];
  };
  createdAt: string;
}
