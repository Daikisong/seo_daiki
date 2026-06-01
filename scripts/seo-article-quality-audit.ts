import { existsSync, writeFileSync } from "node:fs";
import { scoreArticle } from "./seo-article-quality/article-scoring";
import { articleCssSourcePaths, articleQualityPaths, articleRendererSourcePaths, readExistingFile, readExistingFiles } from "./seo-article-quality/paths";
import { readLiveFrontendAnalysis, readTopSeoAnalysis } from "./seo-article-quality/research-readers";
import { renderedArticleChecks } from "./seo-article-quality/rendered-route-checks";
import { rendererChecks, visualChecks } from "./seo-article-quality/static-source-checks";
import type { Article, AuditCheck } from "./seo-article-quality/types";

type ArticleQualityReport = {
  passed: boolean;
  minimumScore: number;
  articleReports: Array<ReturnType<typeof scoreArticle>>;
  rendererChecks: AuditCheck[];
  visualChecks: AuditCheck[];
  researchChecks: AuditCheck[];
  routeReports: Array<ReturnType<typeof renderedArticleChecks>>;
};

function main() {
  if (!existsSync(articleQualityPaths.articlesPath)) {
    throw new Error(`Missing ${articleQualityPaths.articlesPath}`);
  }

  const payload = JSON.parse(readExistingFile(articleQualityPaths.articlesPath)) as { articles?: Article[] };
  const articles = payload.articles ?? [];
  const articleReports = articles.map(scoreArticle);
  const articleRendererSource = readExistingFiles(articleRendererSourcePaths);
  const articleCssSource = readExistingFiles(articleCssSourcePaths);
  const topSeoAnalysis = readTopSeoAnalysis(articleQualityPaths.topSeoAnalysisPath);
  const liveFrontendAnalysis = readLiveFrontendAnalysis(articleQualityPaths.liveFrontendAnalysisPath);

  const checks = {
    renderer: rendererChecks(articleRendererSource),
    visual: visualChecks(articleRendererSource, articleCssSource, articleQualityPaths.selectedUiReferencePath),
    research: researchChecks(topSeoAnalysis, liveFrontendAnalysis),
    routes: articles.map((article) => renderedArticleChecks(article, articleQualityPaths.siteUrl))
  };

  const failedArticles = articleReports.filter((article) => article.score < 99 || article.checks.some((check) => !check.pass));
  const failedRenderer = checks.renderer.filter((check) => !check.pass);
  const failedVisual = checks.visual.filter((check) => !check.pass);
  const failedResearch = checks.research.filter((check) => !check.pass);
  const failedRoutes = checks.routes.filter((route) => route.checks.some((check) => !check.pass));
  const report: ArticleQualityReport = {
    passed: failedArticles.length === 0 && failedRenderer.length === 0 && failedVisual.length === 0 && failedResearch.length === 0 && failedRoutes.length === 0,
    minimumScore: articleReports.length ? Math.min(...articleReports.map((article) => article.score)) : 0,
    articleReports,
    rendererChecks: checks.renderer,
    visualChecks: checks.visual,
    researchChecks: checks.research,
    routeReports: checks.routes
  };

  writeFileSync(articleQualityPaths.reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (!report.passed) {
    throw new Error(
      [
        failedArticles.length ? `Article scores below 99: ${failedArticles.map((article) => `${article.slug}:${article.score}`).join(", ")}` : "",
        failedRenderer.length ? `Renderer checks failed: ${failedRenderer.map((check) => check.name).join(", ")}` : "",
        failedVisual.length ? `Visual checks failed: ${failedVisual.map((check) => check.name).join(", ")}` : "",
        failedResearch.length ? `Research checks failed: ${failedResearch.map((check) => check.name).join(", ")}` : "",
        failedRoutes.length ? `Rendered route checks failed: ${routeFailureSummary(failedRoutes)}` : ""
      ].filter(Boolean).join("\n")
    );
  }

  console.log(`SEO article quality audit passed. Minimum score: ${report.minimumScore}. Report written to ${articleQualityPaths.reportPath}.`);
}

function researchChecks(
  topSeoAnalysis: ReturnType<typeof readTopSeoAnalysis>,
  liveFrontendAnalysis: ReturnType<typeof readLiveFrontendAnalysis>
): AuditCheck[] {
  const topSeoDoc = readExistingFile(articleQualityPaths.topSeoDocPath);
  const liveFrontendDoc = readExistingFile(articleQualityPaths.liveFrontendDocPath);

  return [
    { name: "documents at least 50 actual top-ranking page formats", pass: topSeoAnalysis.pageCount >= 50 },
    { name: "top-page format analysis has unique URLs", pass: topSeoAnalysis.uniqueUrlCount >= 50 },
    { name: "top-page format analysis stores reproducible SERP evidence", pass: topSeoAnalysis.reproducibleEvidenceCount >= 50 },
    {
      name: "top-page analysis covers current markets",
      pass: ["samsung_s90f_review", "iphone_16_br", "renta_2025", "iphone_18_jp", "kr_gaming_monitor"].every((group) =>
        topSeoAnalysis.groups.has(group)
      )
    },
    {
      name: "top-page analysis document exists",
      pass: existsSync(articleQualityPaths.topSeoDocPath) && topSeoDoc.includes("Total pages analyzed: 55") && topSeoDoc.includes("Reproducible Query Groups")
    },
    { name: "documents at least 100 live trend top-site frontend observations", pass: liveFrontendAnalysis.topSiteCount >= 100 },
    { name: "live trend frontend analysis covers at least 20 trend groups", pass: liveFrontendAnalysis.groupCount >= 20 },
    {
      name: "live trend frontend analysis has five sites per group",
      pass: liveFrontendAnalysis.groupsWithFiveSites === liveFrontendAnalysis.groupCount && liveFrontendAnalysis.groupCount >= 20
    },
    { name: "live trend frontend analysis covers multiple countries", pass: liveFrontendAnalysis.marketCount >= 12 },
    {
      name: "live trend frontend analysis stores RSS evidence",
      pass: liveFrontendAnalysis.groupsWithRssEvidence === liveFrontendAnalysis.groupCount && liveFrontendAnalysis.groupCount >= 20
    },
    {
      name: "live trend frontend analysis document exists",
      pass:
        existsSync(articleQualityPaths.liveFrontendDocPath) &&
        liveFrontendDoc.includes("Top/primary sites reviewed: 105") &&
        liveFrontendDoc.includes("Repeated Frontend Patterns")
    }
  ];
}

function routeFailureSummary(routes: Array<ReturnType<typeof renderedArticleChecks>>): string {
  return routes
    .map((route) => `${route.slug}:${route.checks.filter((check) => !check.pass).map((check) => check.name).join("|")}`)
    .join(", ");
}

main();
