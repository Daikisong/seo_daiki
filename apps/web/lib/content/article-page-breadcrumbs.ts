import { articlePath, sectionHrefForArticle } from "@global-import-lab/seo";
import type { Article } from "@global-import-lab/types";

export function breadcrumbItemsForArticle(article: Article) {
  return [
    { label: "Home", href: `/${article.locale}/` },
    {
      label: article.type,
      href: article.type === "hub" ? articlePath(article) : sectionHrefForArticle(article)
    },
    { label: article.h1, href: articlePath(article) }
  ];
}
