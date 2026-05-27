import type { MarketConfig } from "@global-import-lab/types";
import { array, number, readMarketJson, record, slugFromText, text } from "./market-data-file";
import type { MarketKeywordView, MarketTrendView } from "./market-data-types";

export function readMarketTrends(market: MarketConfig): MarketTrendView[] {
  const report = readMarketJson<{ clusters?: unknown[] }>("exports/trend_report.json", { clusters: [] });
  return array(report.clusters)
    .filter((cluster) => record(cluster).market === market.market && record(cluster).language === market.language)
    .map((cluster) => {
      const row = record(cluster);
      return {
        id: text(row.id),
        slug: text(row.slug),
        title: text(row.canonicalTopic),
        keyword: text(row.canonicalTopic),
        score: number(row.score),
        category: text(row.category),
        status: text(row.status),
        summary: `${market.country} ${text(row.category)} trend with ${number(row.signalCount)} signals.`
      };
    });
}

export function readMarketKeywords(market: MarketConfig): MarketKeywordView[] {
  const report = readMarketJson<{ keywords?: unknown[] }>("exports/trend_keywords.json", { keywords: [] });
  return array(report.keywords)
    .filter((keyword) => record(keyword).market === market.market && record(keyword).language === market.language)
    .map((keyword) => {
      const row = record(keyword);
      return {
        id: text(row.id),
        slug: slugFromText(row.keyword),
        keyword: text(row.keyword),
        intent: text(row.searchIntentGuess),
        score: number(row.priorityScore),
        status: text(row.status)
      };
    });
}
