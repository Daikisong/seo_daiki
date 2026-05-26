import type { ArticleType, Locale } from "@global-import-lab/types";
import {
  articles,
  articlesByLocale,
  evidencePacks,
  findArticle,
  findProduct,
  indexedArticles,
  products
} from "./sample-data";

type DbContentRepository = typeof import("@global-import-lab/db/content");

export async function getArticle(locale: Locale, type: ArticleType, slug: string) {
  return withDbContent(
    async (db) => (await db.getDbArticles()).find((article) => article.locale === locale && article.type === type && article.slug === slug),
    () => findArticle(locale, type, slug)
  );
}

export async function getProduct(productId?: string) {
  return withDbContent(
    async (db) => (productId ? (await db.getDbProducts()).find((product) => product.id === productId) : undefined),
    () => findProduct(productId)
  );
}

export async function getEvidencePack(productId: string | undefined, locale: Locale) {
  return withDbContent(
    async (db) => (await db.getDbEvidencePacks()).find((pack) => pack.productId === productId && pack.locale === locale),
    () => evidencePacks.find((pack) => pack.productId === productId && pack.locale === locale)
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

export async function getAllEvidencePacks() {
  return withDbContent(
    async (db) => db.getDbEvidencePacks(),
    () => evidencePacks
  );
}

export async function getArticlesByType(locale: Locale, type: ArticleType) {
  return withDbContent(
    async (db) => (await db.getDbArticles()).filter((article) => article.locale === locale && article.type === type),
    () => articles.filter((article) => article.locale === locale && article.type === type)
  );
}

export async function getProductsByCategory(category: string) {
  return withDbContent(
    async (db) => (await db.getDbProducts()).filter((product) => product.category === category),
    () => products.filter((product) => product.category === category)
  );
}

export async function getAllProducts() {
  return withDbContent(
    async (db) => db.getDbProducts(),
    () => products
  );
}

export async function getStaticArticleParams(type: ArticleType) {
  return withDbContent(
    async (db) =>
      (await db.getDbArticles())
        .filter((article) => article.type === type)
        .map((article) => ({ locale: article.locale, slug: article.slug })),
    () =>
      articles
        .filter((article) => article.type === type)
        .map((article) => ({
          locale: article.locale,
          slug: article.slug
        }))
  );
}

async function withDbContent<T>(loadFromDb: (db: DbContentRepository) => Promise<T>, loadFromSamples: () => T): Promise<T> {
  if (process.env.CONTENT_SOURCE !== "database") {
    return loadFromSamples();
  }

  try {
    const db = await import("@global-import-lab/db/content");
    return await loadFromDb(db);
  } catch (error) {
    console.warn("Falling back to sample content because database content could not be loaded.", error);
    return loadFromSamples();
  }
}
