import {
  absoluteUrl,
  articlePath,
  buildBreadcrumbJsonLd,
  sectionHrefForArticle
} from "@global-import-lab/seo";
import type { Article } from "@global-import-lab/types";

export function buildArticlePageBreadcrumbJsonLd(article: Article) {
  return buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl(`/${article.locale}/`) },
    { name: article.type, url: absoluteUrl(sectionHrefForArticle(article)) },
    { name: article.h1, url: absoluteUrl(articlePath(article)) }
  ]);
}
