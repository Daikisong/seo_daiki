import type { Article, HreflangMap, MarketConfig } from "@global-import-lab/types";
import { canonicalForArticle, hreflangKeyForArticle } from "./article-routes";
import { marketContentPath, marketPath, marketSectionPath } from "./market-routes";
import { absoluteUrl, getSiteUrl } from "./site-url";

export type MarketContentHreflangVariant = {
  market: string;
  language: string;
  path: string;
  hreflang: string;
  status?: string;
  exists?: boolean;
  indexable?: boolean;
};

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
  if (market.language.toLowerCase() === "pt-br") {
    return "pt-BR";
  }
  return `${market.language}-${market.country.toUpperCase()}`;
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

export function buildExistingMarketContentHreflangMap(
  variants: MarketContentHreflangVariant[],
  currentVariant: MarketContentHreflangVariant,
  siteUrl = getSiteUrl(),
  xDefaultPath = "/global/trend-map/"
) {
  const existingVariants = variants.filter((variant) => variant.exists !== false && variant.path);
  const map = Object.fromEntries(
    existingVariants.map((variant) => [variant.hreflang, absoluteUrl(variant.path, siteUrl)])
  ) as HreflangMap;

  if (currentVariant.exists !== false && currentVariant.path) {
    map[currentVariant.hreflang] = absoluteUrl(currentVariant.path, siteUrl);
  }

  map["x-default"] = absoluteUrl(xDefaultPath, siteUrl);
  return map;
}

export function buildMarketContentHreflangMap(
  markets: MarketConfig[],
  current: MarketConfig,
  section: "trends" | "keywords" | "serp" | "briefs" | "posts",
  slug: string,
  siteUrl = getSiteUrl()
) {
  const variants = markets
    .filter((market) => market.enabled)
    .map((market) => ({
      market: market.market,
      language: market.language,
      path: marketContentPath(market, section, slug),
      hreflang: hreflangKeyForMarket(market),
      exists: true,
      indexable: true
    }));
  return buildExistingMarketContentHreflangMap(
    variants,
    {
      market: current.market,
      language: current.language,
      path: marketContentPath(current, section, slug),
      hreflang: hreflangKeyForMarket(current),
      exists: true,
      indexable: true
    },
    siteUrl
  );
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
