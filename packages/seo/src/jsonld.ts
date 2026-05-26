import type { Article, Product } from "@global-import-lab/types";
import { canonicalForArticle, getSiteUrl, localeConfig } from "./canonical";

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

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

export function buildProductJsonLd(product: Product, article: Article, siteUrl = getSiteUrl()) {
  const url = canonicalForArticle(article, siteUrl);
  return {
    ...buildProductSnippetJsonLd(product, url),
    description: article.summary,
    review: buildReviewJsonLd(article, product, siteUrl),
  };
}

export function buildProductSnippetJsonLd(product: Product, url?: string) {
  const latestPrice = product.priceSnapshots.at(-1);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.canonicalName,
    brand: product.brandClaim ? { "@type": "Brand", name: product.brandClaim } : undefined,
    category: product.category,
    offers: latestPrice
      ? {
          "@type": "Offer",
          priceCurrency: latestPrice.currency,
          price: latestPrice.finalPrice ?? latestPrice.price,
          availability: "https://schema.org/InStock",
          url
        }
      : undefined
  };
}

export function buildReviewJsonLd(article: Article, product: Product, siteUrl = getSiteUrl()) {
  return {
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: product.canonicalName
    },
    name: article.title,
    reviewBody: article.summary,
    author: { "@type": "Organization", name: "Global Import Lab" },
    publisher: { "@type": "Organization", name: "Global Import Lab" },
    url: canonicalForArticle(article, siteUrl),
    positiveNotes: {
      "@type": "ItemList",
      itemListElement: product.verifiedClaims.slice(0, 3).map((claim, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${claim.testType}: ${claim.resultValue}${claim.unit ? ` ${claim.unit}` : ""}`
      }))
    },
    negativeNotes: {
      "@type": "ItemList",
      itemListElement: product.variants
        .flatMap((variant) => variant.riskFlags ?? [])
        .slice(0, 3)
        .map((flag, index) => ({ "@type": "ListItem", position: index + 1, name: flag }))
    }
  };
}

export function buildItemListJsonLd(name: string, items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url
    }))
  };
}

export function buildCollectionPageJsonLd(article: Article, items: Array<{ name: string; url: string }>, siteUrl = getSiteUrl()) {
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
