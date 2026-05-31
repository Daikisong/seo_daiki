import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Article = {
  slug?: string;
  title?: string;
  summary?: string;
  sections?: Array<{ heading?: string; body?: string }>;
  heroImage?: { src?: string; alt?: string; caption?: string };
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
  "미리 정한 예시",
  "국가별 트렌드 확인 뒤"
];

function scoreArticle(article: Article) {
  const checks: Array<{ name: string; pass: boolean; points: number }> = [];
  const add = (name: string, pass: boolean, points: number) => checks.push({ name, pass, points });
  const visibleText = [
    article.title,
    article.summary,
    ...(article.sections ?? []).flatMap((section) => [section.heading, section.body])
  ].join(" ");
  const wordLikeCount = visibleText.split(/\s+/).filter(Boolean).length;
  const cjkLength = (visibleText.match(/[가-힣ぁ-んァ-ン一-龥]/g) ?? []).length;

  add("hero image with alt and caption", Boolean(article.heroImage?.src && article.heroImage?.alt && article.heroImage?.caption), 12);
  add("summary is reader-facing", Boolean(article.summary && article.summary.length >= 80), 8);
  add("at least six body sections", (article.sections ?? []).length >= 6, 8);
  add("substantial body length", wordLikeCount >= 450 || cjkLength >= 850, 10);
  add("quick facts", (article.quickFacts ?? []).length >= 4, 8);
  add("checklist UI data", (article.checklist ?? []).length >= 5, 10);
  add("comparison table", Boolean((article.comparisonTable?.columns ?? []).length >= 3 && (article.comparisonTable?.rows ?? []).length >= 3), 10);
  add(
    "source links with checked date",
    (article.sourceLinks ?? []).length >= 3 &&
      (article.sourceLinks ?? []).every((source) => source.label && source.url?.startsWith("http") && source.note && source.checkedAt),
    12
  );
  add(
    "internal links",
    (article.internalLinks ?? []).length >= 3 && (article.internalLinks ?? []).every((link) => link.label && link.href && link.note),
    6
  );
  add("no visible internal workflow phrasing", !forbiddenVisiblePhrases.some((phrase) => visibleText.includes(phrase)), 8);
  add("safe monetization state", article.monetizationDeferred === true && Array.isArray(article.affiliateLinks) && article.affiliateLinks.length === 0, 4);
  add("noindex until promotion", article.indexStatus === "noindex" || article.indexStatus === "index", 4);

  const score = checks.reduce((total, check) => total + (check.pass ? check.points : 0), 0);
  return { slug: article.slug, score, checks };
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
    { name: "renders table of contents", pass: pageSource.includes("Article table of contents") },
    { name: "renders checklist", pass: pageSource.includes("post.checklist") && pageSource.includes("CheckCircle2") },
    { name: "renders comparison table", pass: pageSource.includes("comparisonTable") && pageSource.includes("<table") },
    { name: "renders source links", pass: pageSource.includes("sourceLinks") && pageSource.includes("noopener noreferrer") },
    { name: "renders internal links", pass: pageSource.includes("internalLinks") },
    { name: "renders Article JSON-LD", pass: pageSource.includes("@type") && pageSource.includes("Article") }
  ];

  const failedArticles = articleReports.filter((article) => article.score < 95);
  const failedRenderer = rendererChecks.filter((check) => !check.pass);
  const report = {
    passed: failedArticles.length === 0 && failedRenderer.length === 0,
    minimumScore: Math.min(...articleReports.map((article) => article.score)),
    articleReports,
    rendererChecks
  };
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (!report.passed) {
    throw new Error(
      [
        failedArticles.length ? `Article scores below 95: ${failedArticles.map((article) => `${article.slug}:${article.score}`).join(", ")}` : "",
        failedRenderer.length ? `Renderer checks failed: ${failedRenderer.map((check) => check.name).join(", ")}` : ""
      ].filter(Boolean).join("\n")
    );
  }

  console.log(`SEO article quality audit passed. Minimum score: ${report.minimumScore}. Report written to ${reportPath}.`);
}

main();
