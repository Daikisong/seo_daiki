import type { ArticleType, Locale } from "@global-import-lab/types";
import { articles } from "./sample-data";
import {
  articlesForLocale,
  articlesForType,
  findArticleInList,
  indexablePublishedArticles,
  staticArticleParamsForType
} from "./article-repository-selectors";
import { withDbContent } from "./repository-source";

export async function getArticle(locale: Locale, type: ArticleType, slug: string) {
  return withDbContent(
    async (db) => findArticleInList(await db.getDbArticles(), locale, type, slug),
    () => findArticleInList(articles, locale, type, slug)
  );
}

export async function getLocaleArticles(locale: Locale) {
  return withDbContent(
    async (db) => articlesForLocale(await db.getDbArticles(), locale),
    () => articlesForLocale(articles, locale)
  );
}

export async function getIndexedArticles() {
  return withDbContent(
    async (db) => indexablePublishedArticles(await db.getDbArticles()),
    () => indexablePublishedArticles(articles)
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
    async (db) => articlesForType(await db.getDbArticles(), locale, type),
    () => articlesForType(articles, locale, type)
  );
}

export async function getStaticArticleParams(type: ArticleType) {
  return withDbContent(
    async (db) => staticArticleParamsForType(await db.getDbArticles(), type),
    () => staticArticleParamsForType(articles, type)
  );
}
