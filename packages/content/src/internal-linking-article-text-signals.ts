import type { InternalLinkArticle } from "./internal-linking-types";

export function articleText(article: InternalLinkArticle) {
  return [
    article.slug,
    article.type,
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    article.evidenceIds.join(" "),
    article.sections.map((section) => `${section.heading} ${section.body}`).join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

export function articleTermSet(article: InternalLinkArticle) {
  return new Set(articleText(article).match(/[a-z0-9]+(?:-[a-z0-9]+)?/g) ?? []);
}

export function evidenceOverlap(source: InternalLinkArticle, candidate: InternalLinkArticle) {
  const candidateEvidence = new Set(candidate.evidenceIds);
  return source.evidenceIds.filter((evidenceId) => candidateEvidence.has(evidenceId)).length;
}

export function intersectionCount<T>(left: Set<T>, right: Set<T>) {
  let count = 0;
  for (const item of left) {
    if (right.has(item)) {
      count += 1;
    }
  }
  return count;
}
