import type { ArticleType, Locale } from "@global-import-lab/types";
import { articles, articlesByLocale, findArticle, indexedArticles } from "./sample-data";
import { withDbContent } from "./repository-source";

export async function getArticle(locale: Locale, type: ArticleType, slug: string) {
  return withDbContent(
    async (db) => (await db.getDbArticles()).find((article) => article.locale === locale && article.type === type && article.slug === slug),
    () => findArticle(locale, type, slug)
  );
}

export async function getLocaleArticles(locale: Locale) {
  return withDbContent(
    async (db) => (await db.getDbArticles()).filter((article) => article.locale === locale),
    () => articlesByLocale(locale)
  );
}

export async function getIndexedArticles() {
  return withDbContent(
    async (db) =>
      (await db.getDbArticles()).filter((article) => article.indexStatus === "index" && article.publishStatus === "published"),
    () => indexedArticles()
  );
}

export async function getAllArticles() {
  return withDbContent(
    async (db) => db.getDbArticles(),
    () => articles
  );
}

export async function getArticlesByType(locale: Locale, type: ArticleType) {
  return withDbContent(
    async (db) => (await db.getDbArticles()).filter((article) => article.locale === locale && article.type === type),
    () => articles.filter((article) => article.locale === locale && article.type === type)
  );
}

export async function getStaticArticleParams(type: ArticleType) {
  return withDbContent(
    async (db) =>
      (await db.getDbArticles())
        .filter((article) => article.type === type && article.publishStatus === "published")
        .map((article) => ({ locale: article.locale, slug: article.slug })),
    () =>
      articles
        .filter((article) => article.type === type && article.publishStatus === "published")
        .map((article) => ({
          locale: article.locale,
          slug: article.slug
        }))
  );
}
