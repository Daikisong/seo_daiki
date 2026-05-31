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
        heroImage: imageValue(row.heroImage),
        articleMeta: {
          checkedAt: text(record(row.articleMeta).checkedAt),
          readingTime: text(record(row.articleMeta).readingTime),
          reviewer: text(record(row.articleMeta).reviewer),
          basis: text(record(row.articleMeta).basis)
        },
        keyTakeaways: array(row.keyTakeaways).map((item) => text(item)).filter(Boolean),
        verdictBox: verdictBoxValue(row.verdictBox),
        prosCons: prosConsValue(row.prosCons),
        serpReferences: array(row.serpReferences).map((item) => ({
          rank: text(record(item).rank),
          label: text(record(item).label),
          url: text(record(item).url),
          formatPattern: text(record(item).formatPattern)
        })),
        quickFacts: array(row.quickFacts).map((item) => ({ label: text(record(item).label), value: text(record(item).value) })),
        checklist: array(row.checklist).map((item) => text(item)).filter(Boolean),
        comparisonTable: tableValue(row.comparisonTable),
        sourceLinks: array(row.sourceLinks).map((item) => ({
          label: text(record(item).label),
          url: text(record(item).url),
          note: text(record(item).note),
          checkedAt: text(record(item).checkedAt)
        })),
        internalLinks: array(row.internalLinks).map((item) => ({
          label: text(record(item).label),
          href: text(record(item).href),
          note: text(record(item).note)
        })),
        seoReadinessScore: Number(row.seoReadinessScore) || 0,
        monetizationDeferred: row.monetizationDeferred !== false,
        productCandidateState: text(row.productCandidateState) || "pending",
        affiliateLinks: array(row.affiliateLinks),
        indexStatus: text(row.indexStatus),
        publishStatus: text(row.publishStatus)
      };
    });
}

function verdictBoxValue(value: unknown): MarketPostView["verdictBox"] {
  const row = record(value);
  const label = text(row.label);
  const body = text(row.body);
  if (!label || !body) {
    return undefined;
  }
  return { label, body };
}

function prosConsValue(value: unknown): MarketPostView["prosCons"] {
  const row = record(value);
  const pros = array(row.pros).map((item) => text(item)).filter(Boolean);
  const cons = array(row.cons).map((item) => text(item)).filter(Boolean);
  if (pros.length === 0 || cons.length === 0) {
    return undefined;
  }
  return { pros, cons };
}

function imageValue(value: unknown): MarketPostView["heroImage"] {
  const row = record(value);
  const src = text(row.src);
  if (!src) {
    return undefined;
  }
  return {
    src,
    alt: text(row.alt),
    caption: text(row.caption)
  };
}

function tableValue(value: unknown): MarketPostView["comparisonTable"] {
  const row = record(value);
  const title = text(row.title);
  const columns = array(row.columns).map((item) => text(item)).filter(Boolean);
  const rows = array(row.rows)
    .map((item) => array(item).map((cell) => text(cell)))
    .filter((item) => item.length > 0);
  if (!title || columns.length === 0 || rows.length === 0) {
    return undefined;
  }
  return { title, columns, rows };
}

export function readMarketCalendar(market: MarketConfig) {
  const report = readMarketJson<{ calendars?: unknown[] }>("exports/market_editorial_calendars.json", { calendars: [] });
  return array(report.calendars).find((item) => record(item).market === market.market && record(item).language === market.language);
}
