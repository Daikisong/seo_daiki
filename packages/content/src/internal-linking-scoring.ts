import type { ArticleType, Product } from "@global-import-lab/types";
import {
  articleCategory,
  articleTermSet,
  evidenceOverlap,
  intersectionCount,
  productForArticle,
  riskOverlapScore,
  riskProblemOverlap
} from "./internal-linking-article-signals";
import { priceBandScore } from "./internal-linking-price-band-score";
import { linkableArticleTypes } from "./internal-linking-taxonomy";
import { typeAffinityScore } from "./internal-linking-type-affinity";
import type { InternalLinkArticle } from "./internal-linking-types";

export function scoreInternalLink(source: InternalLinkArticle, candidate: InternalLinkArticle, products: Product[]) {
  let score = 40; // same_locale_score: candidates are filtered to the same locale before scoring.

  const sourceProduct = productForArticle(source, products);
  const candidateProduct = productForArticle(candidate, products);
  const sourceTerms = articleTermSet(source);
  const candidateTerms = articleTermSet(candidate);
  const sharedTerms = intersectionCount(sourceTerms, candidateTerms);

  if (sourceProduct && candidateProduct && sourceProduct.id === candidateProduct.id) {
    score += 28;
  }

  if (articleCategory(source, products) && articleCategory(source, products) === articleCategory(candidate, products)) {
    score += 18; // same_category_score
  }

  score += Math.min(24, evidenceOverlap(source, candidate) * 8); // same_claim_score
  score += Math.min(20, riskProblemOverlap(sourceTerms, candidateTerms) * 5); // same_problem_score
  score += riskOverlapScore(source, candidate, products); // risk_overlap_score
  score += priceBandScore(sourceProduct, candidateProduct); // alternative_price_band_score
  score += typeAffinityScore(source, candidate);
  score += Math.min(12, sharedTerms);

  if (source.type === candidate.type) {
    score -= 6;
  }

  if (source.group === candidate.group) {
    score += 6;
  }

  return score;
}

export function sortScoredInternalLinks(
  left: { candidate: InternalLinkArticle; score: number },
  right: { candidate: InternalLinkArticle; score: number }
) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  const typeOrder = linkableArticleTypes.indexOf(left.candidate.type) - linkableArticleTypes.indexOf(right.candidate.type);
  if (typeOrder !== 0) {
    return typeOrder;
  }

  return left.candidate.slug.localeCompare(right.candidate.slug);
}

export { priceBandScore } from "./internal-linking-price-band-score";
export { typeAffinityScore } from "./internal-linking-type-affinity";
