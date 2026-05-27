import {
  buildArticleJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd
} from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";
import { buildArticlePageBreadcrumbJsonLd } from "./article-page-jsonld-breadcrumbs";
import { internalLinkSchemaItems } from "./article-page-jsonld-links";
import { linkedProductSnippetJsonLd } from "./article-page-jsonld-products";

export function buildArticlePageJsonLd(article: Article, product: Product | undefined, allProducts: Product[], allArticles: Article[]) {
  const breadcrumbs = buildArticlePageBreadcrumbJsonLd(article);
  const articleJsonLd = buildArticleJsonLd(article);

  if (article.type === "data") {
    return [articleJsonLd, buildDatasetJsonLd(article), breadcrumbs];
  }

  if (article.type === "review" && product) {
    return [articleJsonLd, buildProductJsonLd(product, article), breadcrumbs];
  }

  if (article.type === "hub" || article.type === "compare") {
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
      ...linkedProductSnippetJsonLd(article, allProducts, allArticles),
      breadcrumbs
    ];
  }

  return [articleJsonLd, breadcrumbs];
}
