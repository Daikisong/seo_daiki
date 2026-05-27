import type { Article, Product } from "@global-import-lab/types";
import { canonicalForArticle } from "./article-routes";
import { getSiteUrl } from "./site-url";

export function buildProductJsonLd(product: Product, article: Article, siteUrl = getSiteUrl()) {
  const url = canonicalForArticle(article, siteUrl);
  return {
    ...buildProductSnippetJsonLd(product, url),
    description: article.summary,
    review: buildReviewJsonLd(article, product, siteUrl)
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
