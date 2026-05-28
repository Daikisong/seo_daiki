import type { Locale, Product } from "@global-import-lab/types";

export function plannedEvidenceIds(products: Product[], locale: Locale, productId: string) {
  const product = products.find((item) => item.id === productId) ?? products[0];
  const localeRiskId = product.marketRisks.find((risk) => risk.locale === locale)?.id ?? product.marketRisks[0]?.id;
  const reviewSignalId =
    product.reviewSignals.find((signal) => signal.locale === locale)?.id ??
    product.reviewSignals.find((signal) => signal.locale === "en")?.id;
  return [
    ...product.verifiedClaims.slice(0, 2).map((claim) => claim.id),
    ...product.sellerClaims.slice(0, 2).map((claim) => claim.id),
    reviewSignalId,
    localeRiskId
  ].filter(Boolean) as string[];
}
