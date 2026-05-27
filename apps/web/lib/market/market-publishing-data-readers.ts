import type { MarketConfig } from "@global-import-lab/types";
import { array, readMarketJson, record, text } from "./market-data-file";
import type { MarketBriefView, MarketPostView } from "./market-data-types";

export function readMarketBriefs(market: MarketConfig): MarketBriefView[] {
  const report = readMarketJson<{ strategies?: unknown[] }>("exports/content_strategies.json", { strategies: [] });
  return array(report.strategies)
    .filter((item) => record(item).market === market.market && record(item).language === market.language)
    .map((item) => {
      const row = record(item);
      return {
        id: text(row.id),
        slug: text(row.slug),
        title: text(row.titleStrategy),
        angle: text(row.recommendedAngle),
        sections: array(row.sectionPlanJson).map((value) => text(record(value).heading || value)).filter(Boolean),
        monetizationDeferred: row.monetizationDeferred !== false
      };
    });
}

export function readMarketPosts(market: MarketConfig): MarketPostView[] {
  const report = readMarketJson<{ articles?: unknown[] }>("exports/test_articles.json", { articles: [] });
  return array(report.articles)
    .filter((item) => record(item).market === market.market && record(item).language === market.language)
    .map((item) => {
      const row = record(item);
      return {
        id: text(row.id),
        slug: text(row.slug),
        title: text(row.title),
        status: text(row.status),
        summary: text(row.summary),
        sections: array(row.sections).map((section) => ({
          heading: text(record(section).heading),
          body: text(record(section).body)
        })),
        productCandidateState: text(row.productCandidateState) || "pending"
      };
    });
}

export function readMarketCalendar(market: MarketConfig) {
  const report = readMarketJson<{ calendars?: unknown[] }>("exports/market_editorial_calendars.json", { calendars: [] });
  return array(report.calendars).find((item) => record(item).market === market.market && record(item).language === market.language);
}
