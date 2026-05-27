import type {
  Locale,
  ReviewSignal,
  SellerClaim,
  VerifiedClaim
} from "@global-import-lab/types";
import type {
  DbReviewSignalRow,
  DbSellerClaimRow,
  DbVerifiedClaimRow
} from "./contentRepositoryProductRows";

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
