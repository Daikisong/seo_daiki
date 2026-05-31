import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

type Article = {
  market?: string;
  language?: string;
  slug?: string;
  title?: string;
  summary?: string;
  sections?: Array<{ heading?: string; body?: string }>;
  heroImage?: { src?: string; alt?: string; caption?: string };
  articleMeta?: { checkedAt?: string; readingTime?: string; reviewer?: string; basis?: string };
  keyTakeaways?: unknown[];
  verdictBox?: { label?: string; body?: string };
  prosCons?: { pros?: unknown[]; cons?: unknown[] };
  serpReferences?: Array<{ rank?: string; label?: string; url?: string; formatPattern?: string }>;
  quickFacts?: unknown[];
  checklist?: unknown[];
  comparisonTable?: { columns?: unknown[]; rows?: unknown[] };
  sourceLinks?: Array<{ label?: string; url?: string; note?: string; checkedAt?: string }>;
  internalLinks?: Array<{ label?: string; href?: string; note?: string }>;
  seoReadinessScore?: number;
  affiliateLinks?: unknown[];
  monetizationDeferred?: boolean;
  indexStatus?: string;
};

const root = process.cwd();
const articlesPath = resolve(root, "data/exports/test_articles.json");
const pagePath = resolve(root, "apps/web/app/[locale]/[language]/posts/[slug]/page.tsx");
const cssPath = resolve(root, "apps/web/app/globals.css");
const reportPath = resolve(root, "data/exports/seo_article_quality_report.json");
const topSeoAnalysisPath = resolve(root, "data/research/top-seo-page-format-analysis.json");
const topSeoDocPath = resolve(root, "docs/top-seo-50-page-format-analysis.md");
const liveFrontendAnalysisPath = resolve(root, "data/research/live-trending-frontend-top-sites-2026-05-31.json");
const liveFrontendDocPath = resolve(root, "docs/live-trending-100-frontend-format-analysis.md");
const selectedUiReferencePath = resolve(root, "docs/0531/ui-ref-01-editorial-guide-ko.png");
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const forbiddenVisiblePhrases = [
  "test_published",
  "상품 후보",
  "수익화 보류",
  "Website Test Post",
  "Product candidate",
  "selected from country-level",
  "prefilled topic",
  "manual SERP",
  "수동 SERP",
  "뉴스를",
  "Index-ready",
  "Ready after editor",
  "editor checks",
  "공개 준비",
  "SERP 분석",
  "Trend signal",
  "트렌드 신호",
  "상위 글",
  "검색 글",
  "El formato",
  "formato más útil",
  "formato mas util",
  "The winning format",
  "上位の噂まとめ",
  "미리 정한 예시",
  "국가별 트렌드 확인 뒤"
];

function scoreArticle(article: Article) {
  const checks: Array<{ name: string; pass: boolean; points: number }> = [];
  const add = (name: string, pass: boolean, points: number) => checks.push({ name, pass, points });
  const visibleText = [
    article.title,
    article.summary,
    ...(article.sections ?? []).flatMap((section) => [section.heading, section.body]),
    ...(article.keyTakeaways ?? []),
    ...(article.quickFacts ?? []).flatMap((fact) => {
      if (fact && typeof fact === "object" && "label" in fact && "value" in fact) {
        return [String(fact.label), String(fact.value)];
      }
      return [];
    }),
    ...(article.checklist ?? []),
    ...(article.sourceLinks ?? []).flatMap((source) => [source.label, source.note])
  ].join(" ");
  const wordLikeCount = visibleText.split(/\s+/).filter(Boolean).length;
  const cjkLength = (visibleText.match(/[가-힣ぁ-んァ-ン一-龥]/g) ?? []).length;

  add("hero image with alt and caption", Boolean(article.heroImage?.src && article.heroImage?.alt && article.heroImage?.caption), 8);
  add("article metadata", Boolean(article.articleMeta?.checkedAt && article.articleMeta?.readingTime && article.articleMeta?.basis), 6);
  add("summary is reader-facing", Boolean(article.summary && article.summary.length >= 80), 6);
  add("at least six body sections", (article.sections ?? []).length >= 6, 6);
  add("first section gives the answer early", Boolean(article.sections?.[0]?.heading && article.sections?.[0]?.body), 4);
  add("substantial body length", wordLikeCount >= 450 || cjkLength >= 850, 6);
  add("reviewer and checked date", Boolean(article.articleMeta?.checkedAt && article.articleMeta?.reviewer), 8);
  add("key takeaways", (article.keyTakeaways ?? []).length >= 3, 7);
  add("verdict box", Boolean(article.verdictBox?.label && article.verdictBox?.body), 6);
  add("quick facts", (article.quickFacts ?? []).length >= 3, 5);
  add("checklist UI data", (article.checklist ?? []).length >= 5, 6);
  add("comparison table", Boolean((article.comparisonTable?.columns ?? []).length >= 3 && (article.comparisonTable?.rows ?? []).length >= 3), 7);
  add("official policy sources lead official-policy topics", officialPolicySourcesLead(article), 4);
  add(
    "source links with checked date",
    (article.sourceLinks ?? []).length >= 3 &&
      (article.sourceLinks ?? []).every((source) => source.label && source.url?.startsWith("http") && source.note && source.checkedAt),
    12
  );
  add("no visible internal workflow phrasing", !forbiddenVisiblePhrases.some((phrase) => visibleText.includes(phrase)), 6);
  add(
    "localized visible support text",
    localizedVisibleTextPass(article, visibleText),
    5
  );
  add("safe monetization state", article.monetizationDeferred === true && Array.isArray(article.affiliateLinks) && article.affiliateLinks.length === 0, 2);
  add("test post remains noindex until promotion", article.indexStatus === "noindex", 2);

  const rawScore = checks.reduce((total, check) => total + (check.pass ? check.points : 0), 0);
  const score = Math.min(rawScore, 100);
  return { slug: article.slug, score, checks };
}

function localizedVisibleTextPass(article: Article, visibleText: string): boolean {
  if ((article.language ?? "en") === "en") {
    return true;
  }
  const englishWorkflowFragments = [
    "Best for",
    "Main risk",
    "Must verify",
    "Index-ready",
    "Ready after",
    "The winning format",
    "Top rumor roundups",
    "Official campaign",
    "Trend/deal source",
    "Buying-threshold context",
    "Guide-style roundup",
    "Search top",
    "상위 검색",
    "상위 글",
    "검색 글",
    "블로그형",
    "편집 큐",
    "Global trend map",
    "El formato",
    "formato más útil",
    "formato mas util",
    "上位の噂まとめ"
  ];
  return !englishWorkflowFragments.some((phrase) => visibleText.includes(phrase));
}

function officialPolicySourcesLead(article: Article): boolean {
  const topicText = `${article.slug ?? ""} ${article.title ?? ""} ${article.summary ?? ""}`.toLowerCase();
  const isPolicyTopic = /학폭|대입|renta|hacienda|aeat|avisos/.test(topicText);
  if (!isPolicyTopic) {
    return true;
  }
  const firstSourceUrl = article.sourceLinks?.[0]?.url ?? "";
  return /agenciatributaria\.gob\.es|hacienda\.gob\.es|kcue\.or\.kr|korea\.kr|adiga\.kr/i.test(firstSourceUrl);
}

function main() {
  if (!existsSync(articlesPath)) {
    throw new Error(`Missing ${articlesPath}`);
  }
  const payload = JSON.parse(readFileSync(articlesPath, "utf8")) as { articles?: Article[] };
  const articles = payload.articles ?? [];
  const articleReports = articles.map(scoreArticle);

  const pageSource = existsSync(pagePath) ? readFileSync(pagePath, "utf8") : "";
  const topSeoAnalysis = readTopSeoAnalysis();
  const liveFrontendAnalysis = readLiveFrontendAnalysis();
  const routeReports = articles.map(renderedArticleChecks);
  const rendererChecks = [
    { name: "renders hero image", pass: pageSource.includes("<img") && pageSource.includes("heroImage") },
    { name: "renders article metadata", pass: pageSource.includes("articleMeta") && pageSource.includes("<time") },
    { name: "renders review-guide article topbar", pass: pageSource.includes("MarketArticleTopbar") && pageSource.includes("market-article-topbar") },
    { name: "renders quick verdict, score, and highlight panel", pass: pageSource.includes("market-article-review-summary") && pageSource.includes("buildReviewSummary") },
    { name: "renders four-card review method strip", pass: pageSource.includes("market-article-trust-strip") && pageSource.includes("buildTrustCards") && pageSource.includes("methodDisclosureLabel") },
    { name: "renders quick navigation chips from article sections", pass: pageSource.includes("market-article-reader-path") && pageSource.includes("buildReaderPathItems") },
    { name: "uses quick navigation instead of duplicate jump-link clutter", pass: !pageSource.includes("market-article-quick-jumps") && !pageSource.includes("buildQuickJumpLinks") },
    { name: "renders key takeaways", pass: pageSource.includes("keyTakeaways") },
    { name: "renders verdict box", pass: pageSource.includes("verdictBox") },
    { name: "renders fit card from pros/cons without old signal-grid clutter", pass: pageSource.includes("market-article-fit-card") && pageSource.includes("buildFitItems") && !pageSource.includes("market-article-signal-grid") },
    { name: "keeps SERP references internal", pass: !pageSource.includes("serpReferences") && !pageSource.includes("market-article-reviewed-pages") },
    { name: "renders table of contents", pass: pageSource.includes("Article table of contents") },
    { name: "renders checklist with action controls", pass: pageSource.includes("post.checklist") && pageSource.includes("market-article-checkmark") && pageSource.includes("checkActionLabel") },
    { name: "renders comparison table", pass: pageSource.includes("comparisonTable") && pageSource.includes("<table") },
    { name: "renders source links", pass: pageSource.includes("sourceLinks") && pageSource.includes("noopener noreferrer") },
    { name: "does not render public research links", pass: !pageSource.includes("publicInternalLinks") && !pageSource.includes("internalLinks.map") },
    { name: "renders answer before checklist and fit blocks", pass: pageSource.indexOf("market-article-answer") > -1 && pageSource.indexOf("market-article-answer") < pageSource.indexOf("market-article-decision-grid") },
    { name: "renders reviewer metadata", pass: pageSource.includes("reviewedBy") && pageSource.includes("articleMeta.reviewer") },
    { name: "renders Article JSON-LD", pass: pageSource.includes("@type") && pageSource.includes("Article") }
  ];

  const cssSource = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
  const visualChecks = [
    { name: "uses editorial hero layout", pass: pageSource.includes("market-article-hero") && cssSource.includes(".market-article-hero") },
    { name: "uses selected Image #1 single-column review reading frame", pass: pageSource.includes("market-article-shell") && cssSource.includes("grid-template-columns: minmax(0, 1fr)") && cssSource.includes(".market-article-right-rail") && cssSource.includes("display: none") },
    { name: "does not use dashboard-like three-column shell", pass: !cssSource.includes("210px minmax(0, 720px) 270px") && !pageSource.includes("market-article-left-rail") },
    { name: "uses top reference method strip not old fact rail", pass: !pageSource.includes("market-article-fact-rail") && cssSource.includes("grid-template-columns: repeat(4, minmax(0, 1fr))") },
    { name: "uses dedicated prose styling", pass: pageSource.includes("market-article-prose") && cssSource.includes(".market-article-prose p") },
    { name: "uses compact answer, verdict, and score blocks", pass: pageSource.includes("market-article-answer") && cssSource.includes(".market-article-answer") && cssSource.includes(".market-article-review-summary") },
    { name: "styles review summary, method strip, quick nav, and side-card patterns", pass: cssSource.includes(".market-article-review-summary") && cssSource.includes(".market-article-trust-strip") && cssSource.includes(".market-article-reader-path") && cssSource.includes(".market-article-side-card") },
    { name: "renders checklist and fit cards as first decision blocks", pass: pageSource.includes("market-article-decision-grid") && cssSource.includes(".market-article-decision-grid") && cssSource.includes(".market-article-fit-card") },
    { name: "keeps primary content visually dominant", pass: cssSource.includes("max-width: 1180px") && cssSource.includes("market-article-main") },
    { name: "uses selected Image #1 reference file", pass: existsSync(selectedUiReferencePath) },
    { name: "uses responsive mobile rules", pass: cssSource.includes("@media (max-width: 860px)") && cssSource.includes("@media (max-width: 560px)") },
    { name: "does not scale font size with viewport width", pass: !/font-size:\s*[^;]*(vw|clamp\()/i.test(cssSource) }
  ];

  const failedArticles = articleReports.filter((article) => article.score < 99 || article.checks.some((check) => !check.pass));
  const failedRenderer = rendererChecks.filter((check) => !check.pass);
  const failedVisual = visualChecks.filter((check) => !check.pass);
  const researchChecks = [
    { name: "documents at least 50 actual top-ranking page formats", pass: topSeoAnalysis.pageCount >= 50 },
    { name: "top-page format analysis has unique URLs", pass: topSeoAnalysis.uniqueUrlCount >= 50 },
    { name: "top-page format analysis stores reproducible SERP evidence", pass: topSeoAnalysis.reproducibleEvidenceCount >= 50 },
    { name: "top-page analysis covers current markets", pass: ["samsung_s90f_review", "iphone_16_br", "renta_2025", "iphone_18_jp", "kr_admission_bullying"].every((group) => topSeoAnalysis.groups.has(group)) },
    { name: "top-page analysis document exists", pass: existsSync(topSeoDocPath) && readFileSync(topSeoDocPath, "utf8").includes("Total pages analyzed: 55") && readFileSync(topSeoDocPath, "utf8").includes("Reproducible Query Groups") },
    { name: "documents at least 100 live trend top-site frontend observations", pass: liveFrontendAnalysis.topSiteCount >= 100 },
    { name: "live trend frontend analysis covers at least 20 trend groups", pass: liveFrontendAnalysis.groupCount >= 20 },
    { name: "live trend frontend analysis has five sites per group", pass: liveFrontendAnalysis.groupsWithFiveSites === liveFrontendAnalysis.groupCount && liveFrontendAnalysis.groupCount >= 20 },
    { name: "live trend frontend analysis covers multiple countries", pass: liveFrontendAnalysis.marketCount >= 12 },
    { name: "live trend frontend analysis stores RSS evidence", pass: liveFrontendAnalysis.groupsWithRssEvidence === liveFrontendAnalysis.groupCount && liveFrontendAnalysis.groupCount >= 20 },
    { name: "live trend frontend analysis document exists", pass: existsSync(liveFrontendDocPath) && readFileSync(liveFrontendDocPath, "utf8").includes("Top/primary sites reviewed: 105") && readFileSync(liveFrontendDocPath, "utf8").includes("Repeated Frontend Patterns") }
  ];
  const failedResearch = researchChecks.filter((check) => !check.pass);
  const failedRoutes = routeReports.filter((route) => route.checks.some((check) => !check.pass));
  const report = {
    passed: failedArticles.length === 0 && failedRenderer.length === 0 && failedVisual.length === 0 && failedResearch.length === 0 && failedRoutes.length === 0,
    minimumScore: Math.min(...articleReports.map((article) => article.score)),
    articleReports,
    rendererChecks,
    visualChecks,
    researchChecks,
    routeReports
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (!report.passed) {
    throw new Error(
      [
        failedArticles.length ? `Article scores below 99: ${failedArticles.map((article) => `${article.slug}:${article.score}`).join(", ")}` : "",
        failedRenderer.length ? `Renderer checks failed: ${failedRenderer.map((check) => check.name).join(", ")}` : "",
        failedVisual.length ? `Visual checks failed: ${failedVisual.map((check) => check.name).join(", ")}` : "",
        failedResearch.length ? `Research checks failed: ${failedResearch.map((check) => check.name).join(", ")}` : "",
        failedRoutes.length ? `Rendered route checks failed: ${failedRoutes.map((route) => `${route.slug}:${route.checks.filter((check) => !check.pass).map((check) => check.name).join("|")}`).join(", ")}` : ""
      ].filter(Boolean).join("\n")
    );
  }

  console.log(`SEO article quality audit passed. Minimum score: ${report.minimumScore}. Report written to ${reportPath}.`);
}

function renderedArticleChecks(article: Article): { slug?: string; path: string; checks: Array<{ name: string; pass: boolean }> } {
  const path = `/${article.market}/${article.language}/posts/${encodeURIComponent(article.slug ?? "")}/`;
  const html = fetchRenderedHtml(`${siteUrl}${path}`);
  const checks = [
    { name: "route returned html", pass: html.length > 0 },
    { name: "review summary rendered", pass: html.includes("market-article-review-summary") },
    { name: "method strip rendered", pass: html.includes("market-article-trust-strip") },
    { name: "reader path rendered", pass: html.includes("market-article-reader-path") },
    { name: "Image #1 topbar rendered", pass: html.includes("market-article-topbar") },
    { name: "fit card rendered", pass: html.includes("market-article-fit-card") },
    { name: "side cards rendered", pass: html.includes("market-article-side-card") },
    {
      name: "reader path before answer before decision cards",
      pass:
        html.indexOf("market-article-reader-path") >= 0 &&
        html.indexOf("market-article-answer") >= 0 &&
        html.indexOf("market-article-decision-grid") >= 0 &&
        html.indexOf("market-article-reader-path") < html.indexOf("market-article-answer") &&
        html.indexOf("market-article-answer") < html.indexOf("market-article-decision-grid")
    },
    { name: "sources rendered", pass: html.includes("market-article-sources") && html.includes("noopener noreferrer") },
    { name: "comparison table rendered", pass: html.includes("market-article-table-section") && html.includes("<table") },
    { name: "no public SERP clutter", pass: !["serpReferences", "market-article-reviewed-pages", "Top pages checked", "확인한 상위 페이지", "상위 글", "검색 글"].some((phrase) => html.includes(phrase)) },
    { name: "no public internal research links", pass: !["편집 큐", "트렌드 신호", "SERP 분석", "Global trend map"].some((phrase) => html.includes(phrase)) }
  ];
  return { slug: article.slug, path, checks };
}

function fetchRenderedHtml(url: string): string {
  try {
    const output = execFileSync("curl", ["-fsSL", url], { encoding: "utf8", timeout: 15000 });
    return output;
  } catch {
    return "";
  }
}

function readTopSeoAnalysis(): { pageCount: number; uniqueUrlCount: number; groups: Set<string>; reproducibleEvidenceCount: number } {
  if (!existsSync(topSeoAnalysisPath)) {
    return { pageCount: 0, uniqueUrlCount: 0, groups: new Set(), reproducibleEvidenceCount: 0 };
  }
  const payload = JSON.parse(readFileSync(topSeoAnalysisPath, "utf8")) as {
    pages?: Array<{
      url?: string;
      queryGroup?: string;
      serpEvidence?: {
        searchQuery?: string;
        searchEngine?: string;
        capturedAt?: string;
        serpLocale?: string;
        device?: string;
        observedResultPosition?: number;
      };
    }>;
  };
  const pages = Array.isArray(payload.pages) ? payload.pages : [];
  return {
    pageCount: pages.length,
    uniqueUrlCount: new Set(pages.map((page) => page.url).filter(Boolean)).size,
    groups: new Set(pages.map((page) => page.queryGroup).filter(Boolean) as string[]),
    reproducibleEvidenceCount: pages.filter((page) =>
      Boolean(
        page.serpEvidence?.searchQuery &&
          page.serpEvidence.searchEngine &&
          page.serpEvidence.capturedAt &&
          page.serpEvidence.serpLocale &&
          page.serpEvidence.device &&
          page.serpEvidence.observedResultPosition
      )
    ).length
  };
}

function readLiveFrontendAnalysis(): {
  groupCount: number;
  topSiteCount: number;
  marketCount: number;
  groupsWithFiveSites: number;
  groupsWithRssEvidence: number;
} {
  if (!existsSync(liveFrontendAnalysisPath)) {
    return { groupCount: 0, topSiteCount: 0, marketCount: 0, groupsWithFiveSites: 0, groupsWithRssEvidence: 0 };
  }
  const payload = JSON.parse(readFileSync(liveFrontendAnalysisPath, "utf8")) as {
    groups?: Array<{
      market?: string;
      searchQuery?: string;
      trendEvidence?: {
        rssUrl?: string;
        rssRank?: number;
        approxTraffic?: string;
        snapshotCapturedAt?: string;
      };
      topSites?: Array<{ url?: string; signals?: unknown[]; observedPosition?: number }>;
    }>;
  };
  const groups = Array.isArray(payload.groups) ? payload.groups : [];
  return {
    groupCount: groups.length,
    topSiteCount: groups.reduce((total, group) => total + (group.topSites?.length ?? 0), 0),
    marketCount: new Set(groups.map((group) => group.market).filter(Boolean)).size,
    groupsWithFiveSites: groups.filter((group) =>
      Boolean(
        group.searchQuery &&
          group.topSites?.length === 5 &&
          group.topSites.every((site) => site.url?.startsWith("http") && site.observedPosition && (site.signals ?? []).length >= 2)
      )
    ).length,
    groupsWithRssEvidence: groups.filter((group) =>
      Boolean(
        group.trendEvidence?.rssUrl?.startsWith("https://trends.google.com/trending/rss") &&
          group.trendEvidence.rssRank &&
          group.trendEvidence.approxTraffic &&
          group.trendEvidence.snapshotCapturedAt
      )
    ).length
  };
}

main();
