import type { MarketConfig } from "@global-import-lab/types";
import { readMarketPosts, readMarketSerp, readMarketTrends } from "../market/market-data-readers";
import { labelsForLanguage } from "../market/ui-labels";

const publicReadyPostStatuses = new Set(["published", "approved_for_index", "index_candidate", "test_published_index_candidate"]);

export type MarketHomeEligibility = {
  eligible: boolean;
  includeEmptyMarketsOverride: boolean;
  counts: {
    trends: number;
    serpOpportunities: number;
    publicReadyPosts: number;
  };
  reasons: string[];
};

export function includeEmptyMarketsInSitemap(env = process.env) {
  return env.INCLUDE_EMPTY_MARKETS_IN_SITEMAP === "true";
}

export function marketHomeSitemapEligibility(market: MarketConfig, env = process.env): MarketHomeEligibility {
  const includeEmptyMarketsOverride = includeEmptyMarketsInSitemap(env);
  const counts = {
    trends: readMarketTrends(market).length,
    serpOpportunities: readMarketSerp(market).length,
    publicReadyPosts: readMarketPosts(market).filter((post) => publicReadyPostStatuses.has(post.status)).length
  };
  const reasons: string[] = [];

  if (!market.enabled) {
    reasons.push("market_disabled");
  }
  if (counts.trends >= 3) {
    reasons.push("trend_cluster_threshold_met");
  }
  if (counts.serpOpportunities >= 3) {
    reasons.push("serp_opportunity_threshold_met");
  }
  if (counts.publicReadyPosts >= 1) {
    reasons.push("public_ready_post_available");
  }
  if (includeEmptyMarketsOverride) {
    reasons.push("include_empty_markets_override");
  }

  const usefulContent = counts.trends >= 3 || counts.serpOpportunities >= 3 || counts.publicReadyPosts >= 1;
  return {
    eligible: market.enabled && (includeEmptyMarketsOverride || usefulContent),
    includeEmptyMarketsOverride,
    counts,
    reasons
  };
}

export function shouldNoindexMarketHome(market: MarketConfig, env = process.env) {
  const labelState = labelsForLanguage(market.language);
  return !marketHomeSitemapEligibility(market, env).eligible || !labelState.complete;
}
