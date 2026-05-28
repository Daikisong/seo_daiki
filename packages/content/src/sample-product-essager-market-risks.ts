import type { MarketRisk } from "@global-import-lab/types";

export const essagerCableMarketRisks: MarketRisk[] = [
  {
    id: "risk-essager-us",
    productId: "prod-essager-cable-100w",
    locale: "en",
    country: "US",
    plugRisk: "none",
    customsRisk: "low",
    certificationRisk: "low",
    returnRisk: "medium",
    localAlternativeNote: "Buy locally when cable authenticity matters more than price.",
    score: 0.36
  },
  {
    id: "risk-essager-es",
    productId: "prod-essager-cable-100w",
    locale: "es",
    country: "ES",
    plugRisk: "none",
    customsRisk: "medium",
    certificationRisk: "low",
    returnRisk: "medium",
    localAlternativeNote: "Check local cable pricing if shipping removes the import advantage.",
    score: 0.43
  },
  {
    id: "risk-essager-br",
    productId: "prod-essager-cable-100w",
    locale: "pt-br",
    country: "BR",
    plugRisk: "none",
    customsRisk: "high",
    certificationRisk: "low",
    returnRisk: "high",
    localAlternativeNote: "Prefer local sellers if tax or delay makes a low-price cable expensive.",
    score: 0.61
  }
];
