import type { InternalLink, Product } from "@global-import-lab/types";
import {
  dedupeInternalLinks,
  internalLinkForArticle
} from "./internal-linking-link-model";
import {
  diversifyInternalLinks,
  eligibleInternalLinkCandidates,
  ensureMinimumInternalLinks,
  scoredInternalLinkCandidates
} from "./internal-linking-selection";
import {
  scoreInternalLink,
  type InternalLinkArticle
} from "./internal-linking-rules";

export { dedupeInternalLinks, scoreInternalLink };
export type { InternalLinkArticle };

export function buildProgrammaticInternalLinks(
  article: InternalLinkArticle,
  candidates: InternalLinkArticle[],
  products: Product[],
  limit = 8
): InternalLink[] {
  const linkableCandidates = eligibleInternalLinkCandidates(article, candidates);
  const scoredCandidates = scoredInternalLinkCandidates(article, linkableCandidates, products);
  const selected = diversifyInternalLinks(article, scoredCandidates, limit);
  const links = selected.map(({ candidate }) => internalLinkForArticle(candidate));

  return ensureMinimumInternalLinks(links, linkableCandidates, limit);
}
