import type { MarketConfig } from "@global-import-lab/types";
import { array, number, readMarketJson, record, slugFromText, text } from "./market-data-file";
import type { MarketKeywordView, MarketTrendView } from "./market-data-types";
import { readMarketBriefs, readMarketPosts } from "./market-publishing-data-readers";

export function readMarketTrends(market: MarketConfig): MarketTrendView[] {
  const report = readMarketJson<{ clusters?: unknown[] }>("exports/trend_report.json", { clusters: [] });
  const briefs = readMarketBriefs(market);
  const posts = readMarketPosts(market);
  return array(report.clusters)
    .filter((cluster) => record(cluster).market === market.market && record(cluster).language === market.language)
    .map((cluster) => {
      const row = record(cluster);
      const slug = text(row.slug);
      const post = posts.find((item) => item.slug === slug);
      const brief = briefs.find((item) => item.slug === slug);
      const title = post?.title || brief?.title || titleCaseTopic(text(row.canonicalTopic));
      const angle = post?.summary || brief?.angle || evidenceLedAngle(market.country, text(row.category), number(row.signalCount));
      return {
        id: text(row.id),
        slug,
        title,
        keyword: text(row.canonicalTopic),
        score: number(row.score),
        category: text(row.category),
        status: text(row.status),
        summary: angle,
        angle: brief?.angle || post?.summary || angle,
        sections: post?.sections ?? [],
        checklist: post?.checklist ?? brief?.sections ?? [],
        sourceLinks: post?.sourceLinks ?? [],
        quickFacts: post?.quickFacts ?? [
          { label: "Market", value: `${market.country} / ${market.language}` },
          { label: "Signals", value: String(number(row.signalCount)) },
          { label: "Status", value: text(row.status) || "pending" }
        ]
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

function titleCaseTopic(value: string) {
  const acronyms = new Set(["oled", "tv", "usb", "gan", "ai", "us", "uk", "eu", "s90f"]);
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const normalized = word.toLowerCase();
      if (acronyms.has(normalized)) {
        return normalized.toUpperCase();
      }
      return `${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`;
    })
    .join(" ");
}

function evidenceLedAngle(country: string, category: string, signalCount: number) {
  return `${country} ${category || "search"} trend with ${signalCount} signals. Verify local intent, source freshness, and monetization fit before publishing.`;
}
