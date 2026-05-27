import type {
  Article,
  ArticleType,
  Locale
} from "@global-import-lab/types";
import { buildArticlesFromDrafts, buildArticleTranslationGroups } from "./article-assembly";
import type { ArticleDraft } from "./article-draft-types";
import { buildGeneratedDraftArticles } from "./planned-article-fixtures";
import { sampleInternalLinks, sampleSections } from "./sample-article-helpers";
import { buildSampleEvidencePacks } from "./sample-evidence-packs";
import { buildTrendBlogDraftArticles } from "./trend-blog-article-fixtures";
import { buildSampleProducts } from "./sample-products";
import { buildBaseDraftArticles } from "./sample-base-draft-articles";

export { plannedIndexTargetTotal, plannedUrlTotal } from "./planned-article-fixtures";

const siteUrl = "https://example.com";
const updatedAt = "2026-05-25";

export const products = buildSampleProducts(updatedAt);

export const evidencePacks = buildSampleEvidencePacks(products, updatedAt);

const baseDraftArticles: ArticleDraft[] = buildBaseDraftArticles({
  updatedAt,
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

const trendBlogDraftArticles: ArticleDraft[] = buildTrendBlogDraftArticles({
  updatedAt,
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

const generatedDraftArticles: ArticleDraft[] = buildGeneratedDraftArticles({
  products,
  updatedAt,
  internalLinks: sampleInternalLinks,
  sections: sampleSections
});

const draftArticles: ArticleDraft[] = [...baseDraftArticles, ...trendBlogDraftArticles, ...generatedDraftArticles];

export const articleTranslationGroups = buildArticleTranslationGroups(draftArticles);

export const articles: Article[] = buildArticlesFromDrafts(draftArticles, {
  products,
  siteUrl
});

export function findArticle(locale: Locale, type: ArticleType, slug: string) {
  return articles.find((article) => article.locale === locale && article.type === type && article.slug === slug);
}

export function findProduct(productId?: string) {
  return productId ? products.find((product) => product.id === productId) : undefined;
}

export function articlesByLocale(locale: Locale) {
  return articles.filter((article) => article.locale === locale);
}

export function indexedArticles() {
  return articles.filter((article) => article.indexStatus === "index" && article.publishStatus === "published");
}
