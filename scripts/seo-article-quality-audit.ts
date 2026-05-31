import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Article = {
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

  add("hero image with alt and caption", Boolean(article.heroImage?.src && article.heroImage?.alt && article.heroImage?.caption), 8);
  add("article metadata", Boolean(article.articleMeta?.checkedAt && article.articleMeta?.readingTime && article.articleMeta?.basis), 6);
  add("summary is reader-facing", Boolean(article.summary && article.summary.length >= 80), 6);
  add("at least six body sections", (article.sections ?? []).length >= 6, 6);
  add("substantial body length", wordLikeCount >= 450 || cjkLength >= 850, 6);
  add(
    "top-page format evidence",
    (article.serpReferences ?? []).length >= 3 &&
      (article.serpReferences ?? []).every((source) => source.rank && source.label && source.url?.startsWith("http") && source.formatPattern),
    10
  );
  add("key takeaways", (article.keyTakeaways ?? []).length >= 3, 7);
  add("verdict box", Boolean(article.verdictBox?.label && article.verdictBox?.body), 6);
  add("pros and cons", Boolean((article.prosCons?.pros ?? []).length >= 3 && (article.prosCons?.cons ?? []).length >= 3), 7);
  add("quick facts", (article.quickFacts ?? []).length >= 4, 5);
  add("checklist UI data", (article.checklist ?? []).length >= 5, 6);
  add("comparison table", Boolean((article.comparisonTable?.columns ?? []).length >= 3 && (article.comparisonTable?.rows ?? []).length >= 3), 7);
  add(
    "source links with checked date",
    (article.sourceLinks ?? []).length >= 3 &&
      (article.sourceLinks ?? []).every((source) => source.label && source.url?.startsWith("http") && source.note && source.checkedAt),
    7
  );
  add(
    "internal links",
    (article.internalLinks ?? []).length >= 3 && (article.internalLinks ?? []).every((link) => link.label && link.href && link.note),
    4
  );
  add("no visible internal workflow phrasing", !forbiddenVisiblePhrases.some((phrase) => visibleText.includes(phrase)), 5);
  add("safe monetization state", article.monetizationDeferred === true && Array.isArray(article.affiliateLinks) && article.affiliateLinks.length === 0, 2);
  add("noindex until promotion", article.indexStatus === "noindex" || article.indexStatus === "index", 2);

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
    { name: "renders article metadata", pass: pageSource.includes("articleMeta") && pageSource.includes("<time") },
    { name: "renders key takeaways", pass: pageSource.includes("keyTakeaways") },
    { name: "renders verdict box", pass: pageSource.includes("verdictBox") },
    { name: "renders pros and cons", pass: pageSource.includes("prosCons") },
    { name: "renders top-page references", pass: pageSource.includes("serpReferences") },
    { name: "renders table of contents", pass: pageSource.includes("Article table of contents") },
    { name: "renders checklist", pass: pageSource.includes("post.checklist") && pageSource.includes("CheckCircle2") },
    { name: "renders comparison table", pass: pageSource.includes("comparisonTable") && pageSource.includes("<table") },
    { name: "renders source links", pass: pageSource.includes("sourceLinks") && pageSource.includes("noopener noreferrer") },
    { name: "renders internal links", pass: pageSource.includes("internalLinks") },
    { name: "renders Article JSON-LD", pass: pageSource.includes("@type") && pageSource.includes("Article") }
  ];

  const failedArticles = articleReports.filter((article) => article.score < 98);
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
        failedArticles.length ? `Article scores below 98: ${failedArticles.map((article) => `${article.slug}:${article.score}`).join(", ")}` : "",
        failedRenderer.length ? `Renderer checks failed: ${failedRenderer.map((check) => check.name).join(", ")}` : ""
      ].filter(Boolean).join("\n")
    );
  }

  console.log(`SEO article quality audit passed. Minimum score: ${report.minimumScore}. Report written to ${reportPath}.`);
}

main();
