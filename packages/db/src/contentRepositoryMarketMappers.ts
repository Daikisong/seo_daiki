import type {
  Locale,
  MarketRisk,
  PriceSnapshot
} from "@global-import-lab/types";
import type {
  DbMarketRiskRow,
  DbPriceSnapshotRow
} from "./contentRepositoryProductRows";

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
