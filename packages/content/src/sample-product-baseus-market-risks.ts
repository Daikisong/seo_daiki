import type { MarketRisk } from "@global-import-lab/types";

export const baseusMarketRisks: MarketRisk[] = [
  {
    id: "risk-baseus-us",
    productId: "prod-baseus-65w",
    locale: "en",
    country: "US",
    plugRisk: "low",
    customsRisk: "low",
    certificationRisk: "medium",
    returnRisk: "medium",
    localAlternativeNote: "Compare with an Amazon-listed charger if office certification matters.",
    score: 0.42
  },
  {
    id: "risk-baseus-gb",
    productId: "prod-baseus-65w",
    locale: "en",
    country: "GB",
    plugRisk: "medium",
    customsRisk: "medium",
    certificationRisk: "medium",
    returnRisk: "medium",
    localAlternativeNote: "Use the UK plug path only when the final price beats a local UK retailer with easier returns.",
    score: 0.5
  },
  {
    id: "risk-baseus-es",
    productId: "prod-baseus-65w",
    locale: "es",
    country: "ES",
    plugRisk: "medium",
    customsRisk: "medium",
    certificationRisk: "medium",
    returnRisk: "medium",
    localAlternativeNote: "Use the EU plug SKU and check final VAT-inclusive price.",
    score: 0.51
  },
  {
    id: "risk-baseus-br",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    country: "BR",
    plugRisk: "medium",
    customsRisk: "high",
    certificationRisk: "medium",
    returnRisk: "high",
    localAlternativeNote: "Compare with Mercado Livre if the final price rises above the buy zone.",
    score: 0.69
  }
];
