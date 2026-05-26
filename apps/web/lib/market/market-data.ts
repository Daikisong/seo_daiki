import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { marketSlug } from "./config";
import type { MarketConfig } from "@global-import-lab/types";

const dataRoot = resolve(process.cwd(), "../../data");

export interface MarketTrendView {
  id: string;
  slug: string;
  title: string;
  keyword: string;
  score: number;
  category: string;
  status: string;
  summary: string;
}

export interface MarketKeywordView {
  id: string;
  slug: string;
  keyword: string;
  intent: string;
  score: number;
  status: string;
}

export interface MarketSerpView {
  id: string;
  slug: string;
  keyword: string;
  dominantIntent: string;
  recommendedAngle: string;
  opportunityScore: number;
  patterns: string[];
}

export interface MarketBriefView {
  id: string;
  slug: string;
  title: string;
  angle: string;
  sections: string[];
  monetizationDeferred: boolean;
}

export interface MarketPostView {
  id: string;
  slug: string;
  title: string;
  status: string;
  summary: string;
  sections: { heading: string; body: string }[];
  productCandidateState: string;
}

export function readMarketTrends(market: MarketConfig): MarketTrendView[] {
  const report = readJson<{ clusters?: unknown[] }>("exports/trend_report.json", { clusters: [] });
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
  const report = readJson<{ keywords?: unknown[] }>("exports/trend_keywords.json", { keywords: [] });
  return array(report.keywords)
    .filter((keyword) => record(keyword).market === market.market && record(keyword).language === market.language)
    .map((keyword) => {
      const row = record(keyword);
      return {
        id: text(row.id),
        slug: text(row.keyword).toLowerCase().replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/gi, "-").replace(/^-|-$/g, ""),
        keyword: text(row.keyword),
        intent: text(row.searchIntentGuess),
        score: number(row.priorityScore),
        status: text(row.status)
      };
    });
}

export function readMarketSerp(market: MarketConfig): MarketSerpView[] {
  const report = readJson<{ opportunities?: unknown[] }>("exports/serp_opportunity_report.json", { opportunities: [] });
  return array(report.opportunities)
    .filter((item) => record(item).market === market.market && record(item).language === market.language)
    .map((item) => {
      const row = record(item);
      return {
        id: text(row.id),
        slug: text(row.keyword).toLowerCase().replace(/[^a-z0-9가-힣ぁ-んァ-ン一-龥]+/gi, "-").replace(/^-|-$/g, ""),
        keyword: text(row.keyword),
        dominantIntent: text(row.dominantIntent),
        recommendedAngle: text(row.recommendedAngle),
        opportunityScore: number(row.opportunityScore),
        patterns: array(row.topPatternsJson).map((value) => text(value)).filter(Boolean)
      };
    });
}

export function readMarketBriefs(market: MarketConfig): MarketBriefView[] {
  const report = readJson<{ strategies?: unknown[] }>("exports/content_strategies.json", { strategies: [] });
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
  const report = readJson<{ articles?: unknown[] }>("exports/test_articles.json", { articles: [] });
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
  const report = readJson<{ calendars?: unknown[] }>("exports/market_editorial_calendars.json", { calendars: [] });
  return array(report.calendars).find((item) => record(item).market === market.market && record(item).language === market.language);
}

export function readGlobalTrendMap() {
  return readJson<{ clusters?: unknown[]; crossMarketPatterns?: unknown[] }>("exports/trend_report.json", {
    clusters: [],
    crossMarketPatterns: []
  });
}

export function readProductCandidateAnalysis() {
  return readJson<{ analyses?: unknown[] }>("exports/product_candidate_analysis.json", { analyses: [] });
}

export function marketKey(market: MarketConfig) {
  return marketSlug(market);
}

function readJson<T>(path: string, fallback: T): T {
  const fullPath = resolve(dataRoot, path);
  if (!existsSync(fullPath)) {
    return fallback;
  }
  return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

function number(value: unknown) {
  return typeof value === "number" ? value : Number(value) || 0;
}
