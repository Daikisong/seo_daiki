import type {
  Locale,
  MarketRisk,
  PriceSnapshot,
  ReviewSignal,
  SellerClaim,
  Variant,
  VerifiedClaim
} from "@global-import-lab/types";
import { jsonArray } from "./contentRepositoryJson";
import type {
  DbMarketRiskRow,
  DbPriceSnapshotRow,
  DbReviewSignalRow,
  DbSellerClaimRow,
  DbVariantRow,
  DbVerifiedClaimRow
} from "./contentRepositoryProductRows";

export function mapDbVariant(variant: DbVariantRow): Variant {
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

export function mapDbSellerClaim(claim: DbSellerClaimRow): SellerClaim {
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

export function mapDbVerifiedClaim(claim: DbVerifiedClaimRow): VerifiedClaim {
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

export function mapDbReviewSignal(signal: DbReviewSignalRow): ReviewSignal {
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

export function mapDbPriceSnapshot(snapshot: DbPriceSnapshotRow): PriceSnapshot {
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

export function mapDbMarketRisk(risk: DbMarketRiskRow): MarketRisk {
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
