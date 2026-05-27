import type { MarketConfig } from "@global-import-lab/types";
import { array, number, readMarketJson, record, slugFromText, text } from "./market-data-file";
import type { MarketSerpView } from "./market-data-types";

export function readMarketSerp(market: MarketConfig): MarketSerpView[] {
  const report = readMarketJson<{ opportunities?: unknown[] }>("exports/serp_opportunity_report.json", { opportunities: [] });
  return array(report.opportunities)
    .filter((item) => record(item).market === market.market && record(item).language === market.language)
    .map((item) => {
      const row = record(item);
      return {
        id: text(row.id),
        slug: slugFromText(row.keyword),
        keyword: text(row.keyword),
        dominantIntent: text(row.dominantIntent),
        recommendedAngle: text(row.recommendedAngle),
        opportunityScore: number(row.opportunityScore),
        patterns: array(row.topPatternsJson).map((value) => text(value)).filter(Boolean)
      };
    });
}

export function readGlobalTrendMap() {
  return readMarketJson<{ clusters?: unknown[]; crossMarketPatterns?: unknown[] }>("exports/trend_report.json", {
    clusters: [],
    crossMarketPatterns: []
  });
}
