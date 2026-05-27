import type { MarketConfig } from "@global-import-lab/types";
import { marketSlug } from "./config";
import { readMarketBriefs, readMarketPosts } from "./market-publishing-data-readers";
import { readMarketSerp } from "./market-serp-data-readers";
import { readMarketKeywords, readMarketTrends } from "./market-trend-data-readers";
import type { MarketContentSection, SluggedMarketItem } from "./market-data-types";

export function marketsWithContentSlug(markets: MarketConfig[], section: MarketContentSection, slug: string) {
  return markets.filter((market) => readMarketContentBySection(market, section).some((item) => item.slug === slug));
}

export function marketKey(market: MarketConfig) {
  return marketSlug(market);
}

export function readMarketContentBySection(market: MarketConfig, section: MarketContentSection): SluggedMarketItem[] {
  if (section === "trends") {
    return readMarketTrends(market);
  }
  if (section === "keywords") {
    return readMarketKeywords(market);
  }
  if (section === "serp") {
    return readMarketSerp(market);
  }
  if (section === "briefs") {
    return readMarketBriefs(market);
  }
  return readMarketPosts(market);
}
