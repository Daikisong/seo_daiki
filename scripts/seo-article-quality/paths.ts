import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const root = process.cwd();

export const articleQualityPaths = {
  articlesPath: resolve(root, "data/exports/test_articles.json"),
  reportPath: resolve(root, "data/exports/seo_article_quality_report.json"),
  topSeoAnalysisPath: resolve(root, "data/research/top-seo-page-format-analysis.json"),
  topSeoDocPath: resolve(root, "docs/top-seo-50-page-format-analysis.md"),
  liveFrontendAnalysisPath: resolve(root, "data/research/live-trending-frontend-top-sites-2026-05-31.json"),
  liveFrontendDocPath: resolve(root, "docs/live-trending-100-frontend-format-analysis.md"),
  selectedUiReferencePath: resolve(root, "docs/0531/ui-ref-01-editorial-guide-ko.png"),
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
};

export const articleRendererSourcePaths = [
  "apps/web/app/[locale]/[language]/posts/[slug]/page.tsx",
  "apps/web/components/market/MarketArticleTopbar.tsx",
  "apps/web/components/market/MarketReviewPostDetail.tsx",
  "apps/web/components/market/MarketNewsPostDetail.tsx",
  "apps/web/components/market/market-review-post-detail-model.ts",
  "apps/web/components/market/market-review-post-detail-labels.ts",
  "apps/web/components/market/market-news-post-detail-model.ts",
  "apps/web/components/market/market-news-post-detail-labels.ts",
  "apps/web/lib/market/market-article-jsonld.ts"
].map((path) => resolve(root, path));

export const articleCssSourcePaths = [
  "apps/web/app/globals.css",
  "apps/web/app/styles/market-shell-and-sections.css",
  "apps/web/app/styles/market-article-detail.css",
  "apps/web/app/styles/market-public-overrides.css"
].map((path) => resolve(root, path));

export function readExistingFile(path: string): string {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

export function readExistingFiles(paths: string[]): string {
  return paths.map(readExistingFile).join("\n");
}
