import type { JsonValue } from "./contentRepositoryJson";

type Nullable<T> = T | null | undefined;

export type DbProductRow = {
  id: string;
  canonicalName: string;
  slug: string;
  category: string;
  brandClaim: Nullable<string>;
  identityConfidence: number;
  imageHash: Nullable<string>;
  variants: DbVariantRow[];
  sellerClaims: DbSellerClaimRow[];
  verifiedClaims: DbVerifiedClaimRow[];
  reviewSignals: DbReviewSignalRow[];
  priceSnapshots: DbPriceSnapshotRow[];
  marketRisks: DbMarketRiskRow[];
};

export type DbVariantRow = {
  id: string;
  productId: string;
  sourceSku: Nullable<string>;
  optionName: string;
  wattageClaim: Nullable<number>;
  plugType: Nullable<string>;
  cableIncluded: Nullable<boolean>;
  sourceUrl: string;
  affiliateUrl: Nullable<string>;
  sellerName: Nullable<string>;
  sellerId: Nullable<string>;
  riskFlags: JsonValue;
};

export type DbSellerClaimRow = {
  id: string;
  productId: string;
  claimType: string;
  claimValue: string;
  rawText: Nullable<string>;
  sourceUrl: Nullable<string>;
  capturedAt: Date;
  confidence: number;
};

export type DbVerifiedClaimRow = {
  id: string;
  productId: string;
  testType: string;
  resultValue: string;
  unit: Nullable<string>;
  method: string;
  evidenceUrl: Nullable<string>;
  confidence: number;
  testedAt: Nullable<Date>;
};

export type DbReviewSignalRow = {
  id: string;
  productId: string;
  locale: string;
  topic: string;
  sentiment: string;
  count: number;
  confidence: number;
  window: Nullable<string>;
};

export type DbPriceSnapshotRow = {
  id: string;
  productId: string;
  variantId: Nullable<string>;
  country: Nullable<string>;
  currency: string;
  price: unknown;
  shipping: Nullable<unknown>;
  coupon: Nullable<unknown>;
  finalPrice: Nullable<unknown>;
  capturedAt: Date;
};

export type DbMarketRiskRow = {
  id: string;
  productId: string;
  locale: string;
  country: Nullable<string>;
  plugRisk: Nullable<string>;
  customsRisk: Nullable<string>;
  certificationRisk: Nullable<string>;
  returnRisk: Nullable<string>;
  localAlternativeNote: Nullable<string>;
  score: number;
};
