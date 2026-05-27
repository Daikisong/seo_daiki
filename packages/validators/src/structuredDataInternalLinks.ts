import type { Article } from "@global-import-lab/types";
import { absoluteUrl } from "@global-import-lab/seo";

export function internalLinkSchemaItems(article: Pick<Article, "internalLinks">) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}
