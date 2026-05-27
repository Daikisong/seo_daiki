import type { InternalLinkArticle } from "./internal-linking-types";

export function eligibleInternalLinkCandidates(article: InternalLinkArticle, candidates: InternalLinkArticle[]) {
  return candidates.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.locale === article.locale &&
      candidate.publishStatus === "published" &&
      candidate.indexStatus === "index"
  );
}
