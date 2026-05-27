import { articlePath } from "@global-import-lab/seo";
import type { InternalLink } from "@global-import-lab/types";
import { linkReasonForArticleType } from "./internal-linking-rules";
import type { InternalLinkArticle } from "./internal-linking-types";

export function internalLinkForArticle(candidate: InternalLinkArticle): InternalLink {
  return {
    label: candidate.title,
    href: articlePath(candidate),
    reason: linkReasonForArticleType(candidate.type)
  };
}

export function dedupeInternalLinks(links: InternalLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
}
