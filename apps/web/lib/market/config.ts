import marketsData from "../../../../data/config/markets.json";
import type { MarketConfig } from "@global-import-lab/types";

export const markets = marketsData as MarketConfig[];

export function enabledMarkets() {
  return markets.filter((market) => market.enabled);
}

export function findMarket(marketCode: string, language: string) {
  return enabledMarkets().find((market) => market.market === marketCode && market.language === language);
}

export function marketSlug(market: Pick<MarketConfig, "market" | "language">) {
  return `${market.market}-${market.language}`;
}

export function defaultMarketForLegacyLocale(locale: string) {
  if (locale === "en") {
    return findMarket("us", "en");
  }
  if (locale === "es") {
    return findMarket("es", "es");
  }
  if (locale === "pt-br") {
    return findMarket("br", "pt-br");
  }
  return undefined;
}
