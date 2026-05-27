import type { Article } from "@global-import-lab/types";
import { canonicalForArticle } from "./article-routes";
import { buildItemListJsonLd } from "./jsonld-navigation";
import { localeConfig } from "./locale-config";
import { getSiteUrl } from "./site-url";

export function buildArticleJsonLd(article: Article, siteUrl = getSiteUrl()) {
  const url = canonicalForArticle(article, siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    inLanguage: localeConfig[article.locale].htmlLang,
    dateModified: article.lastUpdated,
    datePublished: article.lastUpdated,
    mainEntityOfPage: url,
    url
  };
}

export function buildCollectionPageJsonLd(
  article: Article,
  items: Array<{ name: string; url: string }>,
  siteUrl = getSiteUrl()
) {
  const url = canonicalForArticle(article, siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: article.title,
    headline: article.h1,
    description: article.metaDescription,
    inLanguage: localeConfig[article.locale].htmlLang,
    url,
    mainEntity: buildItemListJsonLd(`${article.title} items`, items)
  };
}

export function buildDatasetJsonLd(article: Article, siteUrl = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: article.title,
    description: article.metaDescription,
    inLanguage: localeConfig[article.locale].htmlLang,
    url: canonicalForArticle(article, siteUrl),
    dateModified: article.lastUpdated,
    creator: { "@type": "Organization", name: "Global Import Lab" }
  };
}
