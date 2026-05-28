import type { MarketRisk } from "@global-import-lab/types";

export const ugreenMarketRisks: MarketRisk[] = [
  {
    id: "risk-ugreen-us",
    productId: "prod-ugreen-100w",
    locale: "en",
    country: "US",
    plugRisk: "low",
    customsRisk: "low",
    certificationRisk: "medium",
    returnRisk: "medium",
    localAlternativeNote: "A local retailer is safer if you need easy warranty handling.",
    score: 0.47
  },
  {
    id: "risk-ugreen-es",
    productId: "prod-ugreen-100w",
    locale: "es",
    country: "ES",
    plugRisk: "medium",
    customsRisk: "medium",
    certificationRisk: "medium",
    returnRisk: "medium",
    localAlternativeNote: "Compare with a local EU seller when warranty handling matters.",
    score: 0.53
  },
  {
    id: "risk-ugreen-br",
    productId: "prod-ugreen-100w",
    locale: "pt-br",
    country: "BR",
    plugRisk: "medium",
    customsRisk: "high",
    certificationRisk: "medium",
    returnRisk: "high",
    localAlternativeNote: "Compare with Mercado Livre before importing a higher-price 100W charger.",
    score: 0.72
  }
];
