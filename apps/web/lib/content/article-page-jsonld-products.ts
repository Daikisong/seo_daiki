import {
  absoluteUrl,
  buildProductSnippetJsonLd
} from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";
import { reviewPathForProduct } from "./article-review-linking";

export function linkedProductSnippetJsonLd(article: Article, allProducts: Product[], allArticles: Article[], limit = 10) {
  return allProducts
    .flatMap((item) => {
      const reviewPath = reviewPathForProduct(article.locale, item, allArticles);
      return reviewPath ? [{ product: item, url: absoluteUrl(reviewPath) }] : [];
    })
    .slice(0, limit)
    .map((item) => buildProductSnippetJsonLd(item.product, item.url));
}
