import type { Article } from "@global-import-lab/types";
import { canonicalForArticle } from "./article-routes";
import {
  shouldIncludeInSitemap,
  sitemapChangeFrequency,
  sitemapPriority
} from "./sitemap-policy";

export function buildSitemapEntries(articles: Article[]) {
  return articles.filter(shouldIncludeInSitemap).map((article) => ({
    url: canonicalForArticle(article),
    lastModified: article.lastUpdated,
    changeFrequency: sitemapChangeFrequency(article),
    priority: sitemapPriority(article)
  }));
}

export {
  shouldIncludeInSitemap,
  sitemapChangeFrequency,
  sitemapPriority
} from "./sitemap-policy";
