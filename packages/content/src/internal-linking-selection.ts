import { articlePath } from "@global-import-lab/seo";
import type { ArticleType, InternalLink, Product } from "@global-import-lab/types";
import {
  linkableArticleTypes,
  scoreInternalLink,
  sortScoredInternalLinks
} from "./internal-linking-rules";
import { dedupeInternalLinks, internalLinkForArticle } from "./internal-linking-link-model";
import type { InternalLinkArticle } from "./internal-linking-types";

export interface ScoredInternalLinkCandidate {
  candidate: InternalLinkArticle;
  score: number;
}

export function eligibleInternalLinkCandidates(article: InternalLinkArticle, candidates: InternalLinkArticle[]) {
  return candidates.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.locale === article.locale &&
      candidate.publishStatus === "published" &&
      candidate.indexStatus === "index"
  );
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

export function diversifyInternalLinks(
  source: InternalLinkArticle,
  scoredCandidates: ScoredInternalLinkCandidate[],
  limit: number
) {
  const selected: ScoredInternalLinkCandidate[] = [];
  const selectedHrefs = new Set<string>();
  const typeCounts = new Map<ArticleType, number>();

  for (const preferredType of linkableArticleTypes) {
    if (selected.length >= limit) {
      break;
    }

    if (preferredType === source.type && selected.length >= 5) {
      continue;
    }

    const preferred = scoredCandidates.find(
      (row) => row.candidate.type === preferredType && !selectedHrefs.has(articlePath(row.candidate))
    );

    if (preferred) {
      addInternalLinkCandidate(preferred, selected, selectedHrefs, typeCounts);
    }
  }

  for (const row of scoredCandidates) {
    if (selected.length >= limit) {
      break;
    }

    const href = articlePath(row.candidate);
    const sameTypeCount = typeCounts.get(row.candidate.type) ?? 0;
    if (selectedHrefs.has(href) || sameTypeCount >= 2) {
      continue;
    }

    addInternalLinkCandidate(row, selected, selectedHrefs, typeCounts);
  }

  return selected.sort((left, right) => sortScoredInternalLinks(left, right));
}

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

function addInternalLinkCandidate(
  row: ScoredInternalLinkCandidate,
  selected: ScoredInternalLinkCandidate[],
  selectedHrefs: Set<string>,
  typeCounts: Map<ArticleType, number>
) {
  selected.push(row);
  selectedHrefs.add(articlePath(row.candidate));
  typeCounts.set(row.candidate.type, (typeCounts.get(row.candidate.type) ?? 0) + 1);
}
