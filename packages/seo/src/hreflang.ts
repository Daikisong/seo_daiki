import type { Article, HreflangMap } from "@global-import-lab/types";
import { absoluteUrl, canonicalForArticle, getSiteUrl, hreflangKeyForArticle } from "./canonical";

export function buildHreflangMap(groupedArticles: Article[], current: Article, siteUrl = getSiteUrl()) {
  const sameTypeAndSlugFamily = groupedArticles.filter((article) => article.id === current.id || article.slug === current.slug);
  const map = Object.fromEntries(
    sameTypeAndSlugFamily.map((article) => [hreflangKeyForArticle(article), canonicalForArticle(article, siteUrl)])
  ) as HreflangMap;

  map[hreflangKeyForArticle(current)] = canonicalForArticle(current, siteUrl);
  map["x-default"] = absoluteUrl("/", siteUrl);
  return map;
}
