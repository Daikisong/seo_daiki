import { articlePath } from "@global-import-lab/seo";
import type { ArticleType } from "@global-import-lab/types";
import { sortScoredInternalLinks } from "./internal-linking-rules";
import { linkableArticleTypes } from "./internal-linking-taxonomy";
import type { InternalLinkArticle } from "./internal-linking-types";
import type { ScoredInternalLinkCandidate } from "./internal-linking-candidate-scoring";

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
