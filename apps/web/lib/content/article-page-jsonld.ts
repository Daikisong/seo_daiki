import {
  absoluteUrl,
  articlePath,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd,
  buildProductSnippetJsonLd,
  sectionHrefForArticle
} from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";
import { reviewPathForProduct } from "./article-review-linking";

export function buildArticlePageJsonLd(article: Article, product: Product | undefined, allProducts: Product[], allArticles: Article[]) {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl(`/${article.locale}/`) },
    { name: article.type, url: absoluteUrl(sectionHrefForArticle(article)) },
    { name: article.h1, url: absoluteUrl(articlePath(article)) }
  ]);
  const articleJsonLd = buildArticleJsonLd(article);

  if (article.type === "data") {
    return [articleJsonLd, buildDatasetJsonLd(article), breadcrumbs];
  }

  if (article.type === "review" && product) {
    return [articleJsonLd, buildProductJsonLd(product, article), breadcrumbs];
  }

  if (article.type === "hub" || article.type === "compare") {
    const linkedProducts = allProducts.flatMap((item) => {
      const reviewPath = reviewPathForProduct(article.locale, item, allArticles);
      return reviewPath ? [{ product: item, name: item.canonicalName, url: absoluteUrl(reviewPath) }] : [];
    });
    const itemListLinks = internalLinkSchemaItems(article);

    if (article.type === "hub") {
      return [
        articleJsonLd,
        buildCollectionPageJsonLd(article, itemListLinks),
        buildItemListJsonLd(article.title, itemListLinks),
        breadcrumbs
      ];
    }

    return [
      articleJsonLd,
      buildItemListJsonLd(article.title, itemListLinks),
      ...linkedProducts.slice(0, 10).map((item) => buildProductSnippetJsonLd(item.product, item.url)),
      breadcrumbs
    ];
  }

  return [articleJsonLd, breadcrumbs];
}

export function internalLinkSchemaItems(article: Article) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}
