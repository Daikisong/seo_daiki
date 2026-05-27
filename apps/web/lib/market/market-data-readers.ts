import type { MarketConfig } from "@global-import-lab/types";
import { array, number, readMarketJson, record, slugFromText, text } from "./market-data-file";
import type { MarketBriefView, MarketKeywordView, MarketPostView, MarketSerpView, MarketTrendView } from "./market-data-types";

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

export function readGlobalTrendMap() {
  return readMarketJson<{ clusters?: unknown[]; crossMarketPatterns?: unknown[] }>("exports/trend_report.json", {
    clusters: [],
    crossMarketPatterns: []
  });
}

export function readProductCandidateAnalysis() {
  return readMarketJson<{ analyses?: unknown[] }>("exports/product_candidate_analysis.json", { analyses: [] });
}
