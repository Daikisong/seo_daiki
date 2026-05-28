import type { Article, ArticleType, Locale } from "@global-import-lab/types";

export function findArticleInList(articles: Article[], locale: Locale, type: ArticleType, slug: string) {
  return articles.find((article) => article.locale === locale && article.type === type && article.slug === slug);
}

export function articlesForLocale(articles: Article[], locale: Locale) {
  return articles.filter((article) => article.locale === locale);
}

export function indexablePublishedArticles(articles: Article[]) {
  return articles.filter((article) => article.indexStatus === "index" && article.publishStatus === "published");
}

export function articlesForType(articles: Article[], locale: Locale, type: ArticleType) {
  return articles.filter((article) => article.locale === locale && article.type === type);
}

export function staticArticleParamsForType(articles: Article[], type: ArticleType) {
  return articles
    .filter((article) => article.type === type && article.publishStatus === "published")
    .map((article) => ({
      locale: article.locale,
      slug: article.slug
    }));
}
