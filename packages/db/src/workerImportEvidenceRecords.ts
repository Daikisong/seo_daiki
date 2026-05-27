import { toJson } from "./workerImportJson";
import type { WorkerPack } from "./workerImportTypes";
import { dateValue, numberValue, stringValue } from "./workerImportValueParsing";

export function sellerClaimCreateData(productId: string, product: Record<string, unknown>, claim: Record<string, unknown>) {
  return {
    productId,
    claimType: stringValue(claim.claim_type) || "seller_claim",
    claimValue: stringValue(claim.claim_value) || "unknown",
    rawText: stringValue(claim.raw_text) || undefined,
    sourceUrl: stringValue(claim.source_url) || stringValue(product.source_url) || undefined,
    capturedAt: dateValue(claim.captured_at) ?? dateValue(product.captured_at) ?? new Date(),
    confidence: numberValue(claim.confidence) ?? 0.5
  };
}

export function verifiedClaimCreateData(productId: string, claim: Record<string, unknown>) {
  return {
    productId,
    testType: stringValue(claim.test_type) || stringValue(claim.testType) || "verification",
    resultValue: stringValue(claim.result_value) || stringValue(claim.resultValue) || "unknown",
    unit: stringValue(claim.unit) || undefined,
    method: stringValue(claim.method) || "Worker import",
    evidenceUrl: stringValue(claim.evidence_url) || stringValue(claim.evidenceUrl) || undefined,
    confidence: numberValue(claim.confidence) ?? 0.8,
    testedAt: dateValue(claim.tested_at) ?? dateValue(claim.testedAt) ?? undefined
  };
}

export function reviewSignalCreateData(productId: string, signal: Record<string, unknown>) {
  return {
    productId,
    locale: stringValue(signal.locale) || "en",
    topic: stringValue(signal.topic) || "review signal",
    sentiment: stringValue(signal.sentiment) || "neutral",
    count: numberValue(signal.count) ?? 0,
    confidence: numberValue(signal.confidence) ?? 0.5,
    window: stringValue(signal.window) || undefined
  };
}

export function priceSnapshotCreateData(
  productId: string,
  product: Record<string, unknown>,
  snapshot: Record<string, unknown>
) {
  return {
    productId,
    country: stringValue(snapshot.country) || undefined,
    currency: stringValue(snapshot.currency) || stringValue(product.currency) || "USD",
    price: numberValue(snapshot.price) ?? numberValue(product.price) ?? 0,
    shipping: numberValue(snapshot.shipping) ?? numberValue(product.shipping) ?? undefined,
    coupon: numberValue(snapshot.coupon) ?? undefined,
    finalPrice: numberValue(snapshot.final_price) ?? numberValue(snapshot.finalPrice) ?? undefined,
    capturedAt: dateValue(snapshot.captured_at) ?? dateValue(product.captured_at) ?? new Date()
  };
}

export function marketRiskCreateData(productId: string, risk: Record<string, unknown>) {
  return {
    productId,
    locale: stringValue(risk.locale) || "en",
    country: stringValue(risk.country) || undefined,
    plugRisk: stringValue(risk.plug_risk) || stringValue(risk.plugRisk) || undefined,
    customsRisk: stringValue(risk.customs_risk) || stringValue(risk.customsRisk) || undefined,
    certificationRisk: stringValue(risk.certification_risk) || stringValue(risk.certificationRisk) || undefined,
    returnRisk: stringValue(risk.return_risk) || stringValue(risk.returnRisk) || undefined,
    localAlternativeNote: stringValue(risk.local_alternative_note) || stringValue(risk.localAlternativeNote) || undefined,
    score: numberValue(risk.score) ?? 0.5
  };
}

export function evidencePackCreateData(productId: string, pack: WorkerPack) {
  return {
    productId,
    locale: stringValue(pack.locale) || "en",
    packJson: toJson(pack)
  };
}
