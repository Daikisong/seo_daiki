import { existsSync, readFileSync, writeFileSync } from "node:fs";
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
  const rendererChecks = [
    { name: "renders hero image", pass: pageSource.includes("<img") && pageSource.includes("heroImage") },
    { name: "renders article metadata", pass: pageSource.includes("articleMeta") && pageSource.includes("<time") },
    { name: "renders key takeaways", pass: pageSource.includes("keyTakeaways") },
    { name: "renders verdict box", pass: pageSource.includes("verdictBox") },
    { name: "does not render pros and cons clutter", pass: !pageSource.includes("prosCons") && !pageSource.includes("market-article-signal-grid") },
    { name: "keeps SERP references internal", pass: !pageSource.includes("serpReferences") && !pageSource.includes("market-article-reviewed-pages") },
    { name: "renders table of contents", pass: pageSource.includes("Article table of contents") },
    { name: "renders checklist", pass: pageSource.includes("post.checklist") && pageSource.includes("CheckCircle2") },
    { name: "renders comparison table", pass: pageSource.includes("comparisonTable") && pageSource.includes("<table") },
    { name: "renders source links", pass: pageSource.includes("sourceLinks") && pageSource.includes("noopener noreferrer") },
    { name: "does not render public research links", pass: !pageSource.includes("publicInternalLinks") && !pageSource.includes("internalLinks.map") },
    { name: "renders answer before summary blocks", pass: pageSource.indexOf("market-article-answer") > -1 && pageSource.indexOf("market-article-answer") < pageSource.indexOf("market-article-snapshot") },
    { name: "renders reviewer metadata", pass: pageSource.includes("reviewedBy") && pageSource.includes("articleMeta.reviewer") },
    { name: "renders Article JSON-LD", pass: pageSource.includes("@type") && pageSource.includes("Article") }
  ];

  const cssSource = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
  const visualChecks = [
    { name: "uses editorial hero layout", pass: pageSource.includes("market-article-hero") && cssSource.includes(".market-article-hero") },
    { name: "uses simplified two-column article shell", pass: pageSource.includes("market-article-shell") && cssSource.includes("grid-template-columns: minmax(0, 760px) 260px") },
    { name: "does not use dashboard-like three-column shell", pass: !cssSource.includes("210px minmax(0, 720px) 270px") && !pageSource.includes("market-article-left-rail") },
    { name: "uses fact rail not plain cards", pass: pageSource.includes("market-article-fact-rail") && cssSource.includes(".market-article-fact-rail") },
    { name: "uses dedicated prose styling", pass: pageSource.includes("market-article-prose") && cssSource.includes(".market-article-prose p") },
    { name: "uses compact answer and summary blocks", pass: pageSource.includes("market-article-answer") && cssSource.includes(".market-article-answer") && cssSource.includes(".market-article-verdict") },
    { name: "keeps primary content visually dominant", pass: cssSource.includes("max-width: 1080px") && cssSource.includes("minmax(0, 760px)") },
    { name: "uses responsive mobile rules", pass: cssSource.includes("@media (max-width: 860px)") && cssSource.includes("@media (max-width: 560px)") },
    { name: "does not scale font size with viewport width", pass: !/font-size:\s*[^;]*(vw|clamp\()/i.test(cssSource) }
  ];

  const failedArticles = articleReports.filter((article) => article.score < 99 || article.checks.some((check) => !check.pass));
  const failedRenderer = rendererChecks.filter((check) => !check.pass);
  const failedVisual = visualChecks.filter((check) => !check.pass);
  const report = {
    passed: failedArticles.length === 0 && failedRenderer.length === 0 && failedVisual.length === 0,
    minimumScore: Math.min(...articleReports.map((article) => article.score)),
    articleReports,
    rendererChecks,
    visualChecks
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (!report.passed) {
    throw new Error(
      [
        failedArticles.length ? `Article scores below 99: ${failedArticles.map((article) => `${article.slug}:${article.score}`).join(", ")}` : "",
        failedRenderer.length ? `Renderer checks failed: ${failedRenderer.map((check) => check.name).join(", ")}` : "",
        failedVisual.length ? `Visual checks failed: ${failedVisual.map((check) => check.name).join(", ")}` : ""
      ].filter(Boolean).join("\n")
    );
  }

  console.log(`SEO article quality audit passed. Minimum score: ${report.minimumScore}. Report written to ${reportPath}.`);
}

main();
