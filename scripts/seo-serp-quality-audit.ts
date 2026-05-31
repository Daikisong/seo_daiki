import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type SerpReference = {
  rank?: string;
  label?: string;
  url?: string;
  formatPattern?: string;
};

type SourceLink = {
  label?: string;
  url?: string;
  note?: string;
  checkedAt?: string;
};

type TestArticle = {
  market?: string;
  language?: string;
  slug?: string;
  title?: string;
  sections?: Array<{ heading?: string; body?: string }>;
  serpReferences?: SerpReference[];
  sourceLinks?: SourceLink[];
  checklist?: string[];
  comparisonTable?: {
    title?: string;
    columns?: string[];
    rows?: string[][];
  };
};

type ArticleSerpReport = {
  slug?: string;
  market?: string;
  language?: string;
  passed: boolean;
  issues: string[];
  serpReferenceCount: number;
  uniqueSerpDomains: number;
  overlappingSourceCount: number;
};

const root = process.cwd();
const articlesPath = resolve(root, "data/exports/test_articles.json");
const reportPath = resolve(root, "data/exports/serp_article_quality_report.json");
const minSerpReferences = 3;
const minOverlappingSources = 2;

if (!existsSync(articlesPath)) {
  throw new Error(`Missing article export: ${articlesPath}`);
}

const payload = JSON.parse(readFileSync(articlesPath, "utf8")) as { articles?: TestArticle[] };
const reports = (payload.articles ?? []).map(auditArticle);
const failed = reports.filter((report) => !report.passed);

mkdirSync(resolve(root, "data/exports"), { recursive: true });
writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      passed: failed.length === 0,
      minimumSerpReferences: minSerpReferences,
      minimumOverlappingSources: minOverlappingSources,
      articleCount: reports.length,
      failedCount: failed.length,
      reports
    },
    null,
    2
  )}\n`
);

if (failed.length > 0) {
  throw new Error(
    `SERP article quality audit failed: ${failed
      .map((report) => `${report.market}/${report.language}/${report.slug}: ${report.issues.join("; ")}`)
      .join(" | ")}`
  );
}

console.log(`SERP article quality audit passed for ${reports.length} articles. Report written to ${reportPath}.`);

function auditArticle(article: TestArticle): ArticleSerpReport {
  const issues: string[] = [];
  const serpReferences = article.serpReferences ?? [];
  const sourceLinks = article.sourceLinks ?? [];

  if (serpReferences.length < minSerpReferences) {
    issues.push(`needs at least ${minSerpReferences} SERP references`);
  }

  const ranks = serpReferences.map((reference) => Number(reference.rank));
  if (ranks.some((rank) => !Number.isInteger(rank) || rank <= 0)) {
    issues.push("SERP references must include positive numeric ranks");
  }
  if (new Set(ranks).size !== ranks.length) {
    issues.push("SERP reference ranks must be unique");
  }

  const serpUrls = serpReferences.map((reference) => reference.url ?? "");
  const invalidSerpUrls = serpUrls.filter((url) => !isPublicHttpUrl(url));
  if (invalidSerpUrls.length > 0) {
    issues.push(`SERP references contain invalid public URLs: ${invalidSerpUrls.join(", ")}`);
  }

  const missingFields = serpReferences.filter(
    (reference) => !reference.rank || !reference.label || !reference.url || !reference.formatPattern
  );
  if (missingFields.length > 0) {
    issues.push("each SERP reference needs rank, label, url, and formatPattern");
  }

  const weakFormatPatterns = serpReferences.filter((reference) => !looksLikeFormatAnalysis(reference.formatPattern ?? ""));
  if (weakFormatPatterns.length > 0) {
    issues.push("SERP formatPattern must describe page structure, not just topic relevance");
  }

  const sourceUrls = new Set(sourceLinks.map((source) => normalizeUrl(source.url ?? "")).filter(Boolean));
  const overlappingSourceCount = serpUrls.map(normalizeUrl).filter((url) => url && sourceUrls.has(url)).length;
  if (overlappingSourceCount < minOverlappingSources) {
    issues.push(`needs at least ${minOverlappingSources} source links that overlap with SERP references`);
  }

  if ((article.checklist ?? []).length < 5) {
    issues.push("article needs at least five checklist items derived from SERP/user intent analysis");
  }

  if (!article.comparisonTable?.title || (article.comparisonTable.rows ?? []).length < 3) {
    issues.push("article needs a comparison table with at least three rows");
  }

  const uniqueSerpDomains = new Set(serpUrls.map(domainFromUrl).filter(Boolean)).size;
  if (uniqueSerpDomains < Math.min(serpReferences.length, 3)) {
    issues.push("SERP references should cover at least three unique domains");
  }

  return {
    slug: article.slug,
    market: article.market,
    language: article.language,
    passed: issues.length === 0,
    issues,
    serpReferenceCount: serpReferences.length,
    uniqueSerpDomains,
    overlappingSourceCount
  };
}

function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && !["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function normalizeUrl(value: string) {
  if (!isPublicHttpUrl(value)) {
    return "";
  }
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

function domainFromUrl(value: string) {
  if (!isPublicHttpUrl(value)) {
    return "";
  }
  return new URL(value).hostname.replace(/^www\./, "");
}

function looksLikeFormatAnalysis(value: string) {
  const normalized = value.toLowerCase();
  return [
    "headline",
    "hero",
    "verdict",
    "pros",
    "cons",
    "table",
    "guide",
    "price",
    "spec",
    "official",
    "date",
    "author",
    "comparison",
    "checklist",
    "threshold",
    "review",
    "policy",
    "section",
    "source",
    "ranking",
    "bullets",
    "timeline",
    "feature list",
    "roundup",
    "scannable",
    "practical buyer",
    "총정리",
    "비교",
    "체크리스트",
    "표",
    "공식",
    "자료",
    "첨부파일",
    "사례",
    "확인 목록"
  ].some((term) => normalized.includes(term));
}
