import type { Article } from "@global-import-lab/types";
import { canonicalForArticle } from "./canonical";

export function shouldIncludeInSitemap(article: Article) {
  return article.publishStatus === "published" && article.indexStatus === "index";
}

export function sitemapChangeFrequency(article: Article): "weekly" | "monthly" {
  return article.type === "data" || article.type === "lab" ? "weekly" : "monthly";
}

export function sitemapPriority(article: Article) {
  return article.type === "hub" ? 0.9 : article.type === "review" ? 0.8 : 0.7;
}

export function buildSitemapEntries(articles: Article[]) {
  return articles.filter(shouldIncludeInSitemap).map((article) => ({
    url: canonicalForArticle(article),
    lastModified: article.lastUpdated,
    changeFrequency: sitemapChangeFrequency(article),
    priority: sitemapPriority(article)
  }));
}
