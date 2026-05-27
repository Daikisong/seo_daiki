import { articlePath } from "@global-import-lab/seo";
import type { ArticleType, InternalLink, Product } from "@global-import-lab/types";
import {
  linkReasonForArticleType,
  linkableArticleTypes,
  scoreInternalLink,
  sortScoredInternalLinks,
  type InternalLinkArticle
} from "./internal-linking-rules";

export { scoreInternalLink };
export type { InternalLinkArticle };

export function buildProgrammaticInternalLinks(
  article: InternalLinkArticle,
  candidates: InternalLinkArticle[],
  products: Product[],
  limit = 8
): InternalLink[] {
  const linkableCandidates = candidates.filter(
    (candidate) =>
      candidate.id !== article.id &&
      candidate.locale === article.locale &&
      candidate.publishStatus === "published" &&
      candidate.indexStatus === "index"
  );

  const scoredCandidates = linkableCandidates
    .map((candidate) => ({
      candidate,
      score: scoreInternalLink(article, candidate, products)
    }))
    .filter((row) => row.score > 0)
    .sort((left, right) => sortScoredInternalLinks(left, right));

  const selected = diversifyInternalLinks(article, scoredCandidates, limit);
  const links = selected.map(({ candidate }) => ({
    label: candidate.title,
    href: articlePath(candidate),
    reason: linkReasonForArticleType(candidate.type)
  }));

  return ensureMinimumInternalLinks(article, links, linkableCandidates, limit);
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

function diversifyInternalLinks(
  source: InternalLinkArticle,
  scoredCandidates: Array<{ candidate: InternalLinkArticle; score: number }>,
  limit: number
) {
  const selected: Array<{ candidate: InternalLinkArticle; score: number }> = [];
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

function addInternalLinkCandidate(
  row: { candidate: InternalLinkArticle; score: number },
  selected: Array<{ candidate: InternalLinkArticle; score: number }>,
  selectedHrefs: Set<string>,
  typeCounts: Map<ArticleType, number>
) {
  selected.push(row);
  selectedHrefs.add(articlePath(row.candidate));
  typeCounts.set(row.candidate.type, (typeCounts.get(row.candidate.type) ?? 0) + 1);
}

function ensureMinimumInternalLinks(
  article: InternalLinkArticle,
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
    .map((candidate) => ({
      label: candidate.title,
      href: articlePath(candidate),
      reason: linkReasonForArticleType(candidate.type)
    }));

  return dedupeInternalLinks([...deduped, ...fallbackLinks]).slice(0, limit);
}
