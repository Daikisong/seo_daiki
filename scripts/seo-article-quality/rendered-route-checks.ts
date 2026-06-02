import { execFileSync } from "node:child_process";
import type { Article, AuditCheck } from "./types";

export type RenderedRouteReport = {
  slug?: string;
  path: string;
  checks: AuditCheck[];
};

export function renderedArticleChecks(article: Article, siteUrl: string): RenderedRouteReport {
  const path = `/${article.market}/${article.language}/posts/${encodeURIComponent(article.slug ?? "")}/`;
  const html = fetchRenderedHtml(`${siteUrl}${path}`);
  const visibleHtml = stripScriptData(html);

  if (article.contentBranch === "news") {
    return {
      slug: article.slug,
      path,
      checks: [
        { name: "route returned html", pass: html.length > 0 },
        { name: "news detail rendered", pass: html.includes("market-news-detail-page") },
        { name: "news topbar rendered", pass: html.includes("market-article-topbar") },
        { name: "news table of contents rendered", pass: html.includes("market-news-toc") },
        { name: "news keypoints rendered", pass: html.includes("market-news-keypoints") },
        { name: "no dashboard-like news utility panel", pass: noDashboardLikeNewsUtilityPanel(html) },
        { name: "news body rendered", pass: html.includes("market-news-body") },
        { name: "news sources rendered", pass: html.includes("market-news-source-correction") && html.includes("noopener noreferrer") },
        { name: "NewsArticle JSON-LD rendered", pass: html.includes("NewsArticle") },
        { name: "no public SERP clutter", pass: noPublicSerpClutter(visibleHtml) },
        { name: "no public internal research links", pass: noPublicInternalResearchLinks(visibleHtml) },
        { name: "no serialized news internals", pass: noSerializedNewsInternals(html) }
      ]
    };
  }

  return {
    slug: article.slug,
    path,
    checks: [
      { name: "route returned html", pass: html.length > 0 },
      { name: "review summary rendered", pass: html.includes("market-article-review-summary") },
      { name: "method strip rendered", pass: html.includes("market-article-trust-strip") },
      { name: "reader path rendered", pass: html.includes("market-article-reader-path") },
      { name: "Image #1 topbar rendered", pass: html.includes("market-article-topbar") },
      { name: "fit card rendered", pass: html.includes("market-article-fit-card") },
      { name: "side cards rendered", pass: html.includes("market-article-side-card") },
      { name: "reader path before answer before decision cards", pass: orderedReviewSections(html) },
      { name: "sources rendered", pass: html.includes("market-article-sources") && html.includes("noopener noreferrer") },
      { name: "comparison table rendered", pass: html.includes("market-article-table-section") && html.includes("<table") },
      { name: "no public SERP clutter", pass: noPublicSerpClutter(visibleHtml) },
      { name: "no public internal research links", pass: noPublicInternalResearchLinks(visibleHtml) }
    ]
  };
}

function fetchRenderedHtml(url: string): string {
  try {
    return execFileSync("curl", ["-fsSL", url], { encoding: "utf8", timeout: 15000 });
  } catch {
    return "";
  }
}

function orderedReviewSections(html: string): boolean {
  const readerPathIndex = html.indexOf("market-article-reader-path");
  const answerIndex = html.indexOf("market-article-answer");
  const decisionGridIndex = html.indexOf("market-article-decision-grid");
  return readerPathIndex >= 0 && answerIndex >= 0 && decisionGridIndex >= 0 && readerPathIndex < answerIndex && answerIndex < decisionGridIndex;
}

function noPublicSerpClutter(html: string): boolean {
  return !["serpReferences", "market-article-reviewed-pages", "Top pages checked", "확인한 상위 페이지", "상위 글", "검색 글"].some((phrase) =>
    html.includes(phrase)
  );
}

function noPublicInternalResearchLinks(html: string): boolean {
  return !["편집 큐", "트렌드 신호", "SERP 분석", "Global trend map", "KR 상승 검색어로 확인", "확인 타임라인", "트렌드 확인 타임라인"].some(
    (phrase) => html.includes(phrase)
  );
}

function noSerializedNewsInternals(html: string): boolean {
  return ![
    "contentBranch",
    "monetizationRoute",
    "marketExpansionPolicy",
    "monetizationDeferred",
    "productCandidateState",
    "seoReadinessScore",
    "affiliateLinks",
    "publishStatus",
    "indexStatus",
    "officialCheckLinks",
    "affectedUsers",
    "nextChecks",
    "newsReaderQuestions",
    "newsActionTable",
    "newsGlossary",
    "newsCommonMistakes"
  ].some((phrase) => html.includes(phrase));
}

function noDashboardLikeNewsUtilityPanel(html: string): boolean {
  return ![
    "market-news-action-panel",
    "market-news-official-links",
    "market-news-reader-checks",
    "market-news-reader-questions",
    "market-news-action-table",
    "market-news-explain-grid"
  ].some((phrase) => html.includes(phrase));
}

function stripScriptData(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}
