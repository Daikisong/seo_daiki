import { absoluteUrl } from "@global-import-lab/seo";
import type { Article } from "@global-import-lab/types";

export function internalLinkSchemaItems(article: Article) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}
