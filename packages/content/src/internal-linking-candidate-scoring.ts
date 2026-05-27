import type { Product } from "@global-import-lab/types";
import {
  scoreInternalLink,
  sortScoredInternalLinks
} from "./internal-linking-rules";
import type { InternalLinkArticle } from "./internal-linking-types";

export interface ScoredInternalLinkCandidate {
  candidate: InternalLinkArticle;
  score: number;
}

export function scoredInternalLinkCandidates(
  article: InternalLinkArticle,
  candidates: InternalLinkArticle[],
  products: Product[]
) {
  return candidates
    .map((candidate) => ({
      candidate,
      score: scoreInternalLink(article, candidate, products)
    }))
    .filter((row) => row.score > 0)
    .sort((left, right) => sortScoredInternalLinks(left, right));
}
