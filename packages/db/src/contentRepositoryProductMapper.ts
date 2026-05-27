import type {
  Locale,
  MarketRisk,
  PriceSnapshot,
  Product,
  ReviewSignal,
  SellerClaim,
  Variant,
  VerifiedClaim
} from "@global-import-lab/types";
import { jsonArray, type JsonValue } from "./contentRepositoryJson";

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

type DbVariantRow = {
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

type DbSellerClaimRow = {
  id: string;
  productId: string;
  claimType: string;
  claimValue: string;
  rawText: Nullable<string>;
  sourceUrl: Nullable<string>;
  capturedAt: Date;
  confidence: number;
};

type DbVerifiedClaimRow = {
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

type DbReviewSignalRow = {
  id: string;
  productId: string;
  locale: string;
  topic: string;
  sentiment: string;
  count: number;
  confidence: number;
  window: Nullable<string>;
};

type DbPriceSnapshotRow = {
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

type DbMarketRiskRow = {
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

export function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    canonicalName: row.canonicalName,
    slug: row.slug,
    category: row.category,
    brandClaim: row.brandClaim ?? undefined,
    identityConfidence: row.identityConfidence,
    imageHash: row.imageHash ?? undefined,
    variants: row.variants.map(mapDbVariant),
    sellerClaims: row.sellerClaims.map(mapDbSellerClaim),
    verifiedClaims: row.verifiedClaims.map(mapDbVerifiedClaim),
    reviewSignals: row.reviewSignals.map(mapDbReviewSignal),
    priceSnapshots: row.priceSnapshots.map(mapDbPriceSnapshot),
    marketRisks: row.marketRisks.map(mapDbMarketRisk)
  };
}

function mapDbVariant(variant: DbVariantRow): Variant {
  return {
    id: variant.id,
    productId: variant.productId,
    sourceSku: variant.sourceSku ?? undefined,
    optionName: variant.optionName,
    wattageClaim: variant.wattageClaim ?? undefined,
    plugType: variant.plugType ?? undefined,
    cableIncluded: variant.cableIncluded ?? undefined,
    sourceUrl: variant.sourceUrl,
    affiliateUrl: variant.affiliateUrl ?? undefined,
    sellerName: variant.sellerName ?? undefined,
    sellerId: variant.sellerId ?? undefined,
    riskFlags: jsonArray<string>(variant.riskFlags)
  };
}

function mapDbSellerClaim(claim: DbSellerClaimRow): SellerClaim {
  return {
    id: claim.id,
    productId: claim.productId,
    claimType: claim.claimType,
    claimValue: claim.claimValue,
    rawText: claim.rawText ?? undefined,
    sourceUrl: claim.sourceUrl ?? undefined,
    capturedAt: claim.capturedAt.toISOString().slice(0, 10),
    confidence: claim.confidence
  };
}

function mapDbVerifiedClaim(claim: DbVerifiedClaimRow): VerifiedClaim {
  return {
    id: claim.id,
    productId: claim.productId,
    testType: claim.testType,
    resultValue: claim.resultValue,
    unit: claim.unit ?? undefined,
    method: claim.method,
    evidenceUrl: claim.evidenceUrl ?? undefined,
    confidence: claim.confidence,
    testedAt: claim.testedAt?.toISOString().slice(0, 10)
  };
}

function mapDbReviewSignal(signal: DbReviewSignalRow): ReviewSignal {
  return {
    id: signal.id,
    productId: signal.productId,
    locale: signal.locale as Locale,
    topic: signal.topic,
    sentiment: signal.sentiment as ReviewSignal["sentiment"],
    count: signal.count,
    confidence: signal.confidence,
    window: signal.window ?? undefined
  };
}

function mapDbPriceSnapshot(snapshot: DbPriceSnapshotRow): PriceSnapshot {
  return {
    id: snapshot.id,
    productId: snapshot.productId,
    variantId: snapshot.variantId ?? undefined,
    country: snapshot.country ?? undefined,
    currency: snapshot.currency,
    price: Number(snapshot.price),
    shipping: snapshot.shipping === null || snapshot.shipping === undefined ? undefined : Number(snapshot.shipping),
    coupon: snapshot.coupon === null || snapshot.coupon === undefined ? undefined : Number(snapshot.coupon),
    finalPrice: snapshot.finalPrice === null || snapshot.finalPrice === undefined ? undefined : Number(snapshot.finalPrice),
    capturedAt: snapshot.capturedAt.toISOString().slice(0, 10)
  };
}

function mapDbMarketRisk(risk: DbMarketRiskRow): MarketRisk {
  return {
    id: risk.id,
    productId: risk.productId,
    locale: risk.locale as Locale,
    country: risk.country ?? undefined,
    plugRisk: risk.plugRisk ?? undefined,
    customsRisk: risk.customsRisk ?? undefined,
    certificationRisk: risk.certificationRisk ?? undefined,
    returnRisk: risk.returnRisk ?? undefined,
    localAlternativeNote: risk.localAlternativeNote ?? undefined,
    score: risk.score
  };
}
