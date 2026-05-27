import type { Locale } from "./locales";

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
