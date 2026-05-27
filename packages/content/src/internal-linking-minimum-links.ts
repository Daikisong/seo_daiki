import { articlePath } from "@global-import-lab/seo";
import type { InternalLink } from "@global-import-lab/types";
import { dedupeInternalLinks, internalLinkForArticle } from "./internal-linking-link-model";
import { sortScoredInternalLinks } from "./internal-linking-rules";
import type { InternalLinkArticle } from "./internal-linking-types";

export function ensureMinimumInternalLinks(
  links: InternalLink[],
  candidates: InternalLinkArticle[],
  limit: number
) {
  const deduped = dedupeInternalLinks(links);
  if (deduped.length >= 5) {
    return deduped;
  }

  const existing = new Set(deduped.map((link) => link.href));
  const fallbackLinks = candidates
    .filter((candidate) => !existing.has(articlePath(candidate)))
    .sort((left, right) => sortScoredInternalLinks({ candidate: left, score: 1 }, { candidate: right, score: 1 }))
    .map((candidate) => internalLinkForArticle(candidate));

  return dedupeInternalLinks([...deduped, ...fallbackLinks]).slice(0, limit);
}
