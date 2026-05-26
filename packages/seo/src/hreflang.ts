import type { Article, HreflangMap, MarketConfig } from "@global-import-lab/types";
import { absoluteUrl, canonicalForArticle, getSiteUrl, hreflangKeyForArticle, marketContentPath, marketPath, marketSectionPath } from "./canonical";

export function buildHreflangMap(groupedArticles: Article[], current: Article, siteUrl = getSiteUrl()) {
  const sameTypeAndSlugFamily = groupedArticles.filter((article) => article.id === current.id || article.slug === current.slug);
  const map = Object.fromEntries(
    sameTypeAndSlugFamily.map((article) => [hreflangKeyForArticle(article), canonicalForArticle(article, siteUrl)])
  ) as HreflangMap;

  map[hreflangKeyForArticle(current)] = canonicalForArticle(current, siteUrl);
  map["x-default"] = absoluteUrl("/", siteUrl);
  return map;
}

export function hreflangKeyForMarket(market: Pick<MarketConfig, "country" | "language">) {
  const language = market.language === "pt-br" ? "pt-BR" : market.language;
  return `${language}-${market.country}`;
}

export function buildMarketHreflangMap(markets: MarketConfig[], current: MarketConfig, siteUrl = getSiteUrl()) {
  const sameLanguageMarkets = markets.filter((market) => market.enabled && market.language === current.language);
  const map = Object.fromEntries(
    sameLanguageMarkets.map((market) => [hreflangKeyForMarket(market), absoluteUrl(marketPath(market), siteUrl)])
  ) as HreflangMap;
  map[hreflangKeyForMarket(current)] = absoluteUrl(marketPath(current), siteUrl);
  map["x-default"] = absoluteUrl("/global/markets/", siteUrl);
  return map;
}

export function buildMarketContentHreflangMap(
  markets: MarketConfig[],
  current: MarketConfig,
  section: "trends" | "keywords" | "serp" | "briefs" | "posts",
  slug: string,
  siteUrl = getSiteUrl()
) {
  const relatedMarkets = markets.filter((market) => market.enabled && market.language === current.language);
  const map = Object.fromEntries(
    relatedMarkets.map((market) => [hreflangKeyForMarket(market), absoluteUrl(marketContentPath(market, section, slug), siteUrl)])
  ) as HreflangMap;
  map[hreflangKeyForMarket(current)] = absoluteUrl(marketContentPath(current, section, slug), siteUrl);
  map["x-default"] = absoluteUrl("/global/trend-map/", siteUrl);
  return map;
}

export function buildMarketSectionHreflangMap(
  markets: MarketConfig[],
  current: MarketConfig,
  section: "trends" | "keywords" | "serp" | "briefs" | "posts" | "calendar",
  siteUrl = getSiteUrl()
) {
  const relatedMarkets = markets.filter((market) => market.enabled && market.language === current.language);
  const map = Object.fromEntries(
    relatedMarkets.map((market) => [hreflangKeyForMarket(market), absoluteUrl(marketSectionPath(market, section), siteUrl)])
  ) as HreflangMap;
  map[hreflangKeyForMarket(current)] = absoluteUrl(marketSectionPath(current, section), siteUrl);
  map["x-default"] = absoluteUrl("/global/markets/", siteUrl);
  return map;
}
