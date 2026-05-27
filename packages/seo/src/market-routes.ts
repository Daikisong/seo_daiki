import type { MarketConfig } from "@global-import-lab/types";
import { absoluteUrl, getSiteUrl } from "./site-url";

export function marketPath(market: Pick<MarketConfig, "market" | "language">) {
  return `/${market.market}/${market.language}/`;
}

export function marketSectionPath(
  market: Pick<MarketConfig, "market" | "language">,
  section?: "trends" | "keywords" | "serp" | "briefs" | "posts" | "calendar"
) {
  const base = marketPath(market);
  return section ? `${base}${section}/` : base;
}

export function marketContentPath(
  market: Pick<MarketConfig, "market" | "language">,
  section: "trends" | "keywords" | "serp" | "briefs" | "posts",
  slug: string
) {
  return `${marketSectionPath(market, section)}${slug}/`;
}

export function canonicalForMarketPath(path: string, siteUrl = getSiteUrl()) {
  return absoluteUrl(path, siteUrl);
}
