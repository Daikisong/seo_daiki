import type { ArticleType, Product } from "@global-import-lab/types";
import {
  articleCategory,
  articleTermSet,
  evidenceOverlap,
  intersectionCount,
  priceBand,
  productForArticle,
  riskOverlapScore,
  riskProblemOverlap
} from "./internal-linking-article-signals";
import { linkableArticleTypes } from "./internal-linking-taxonomy";
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

export function typeAffinityScore(source: InternalLinkArticle, candidate: InternalLinkArticle) {
  if (candidate.type === "trend" && source.type !== "trend") {
    return 16;
  }

  if (candidate.type === "buyer_guide" && ["trend", "review", "compare", "deal_watch"].includes(source.type)) {
    return 16;
  }

  if (candidate.type === "deal_watch" && ["buyer_guide", "review", "compare", "trend"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "ingredient_guide" && ["trend", "buyer_guide"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "hub" && source.type !== "hub") {
    return 18;
  }

  if (candidate.type === "methodology" && source.type !== "methodology") {
    return 14;
  }

  if ((candidate.type === "data" || candidate.type === "lab") && ["review", "guide", "compare", "risk"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "risk" && ["review", "guide", "compare", "hub"].includes(source.type)) {
    return 14;
  }

  if (candidate.type === "compare" && ["review", "guide", "hub", "risk"].includes(source.type)) {
    return 10;
  }

  if (candidate.type === "guide" && ["review", "risk", "compare", "hub"].includes(source.type)) {
    return 10;
  }

  if (candidate.type === "review" && ["guide", "compare", "hub", "risk"].includes(source.type)) {
    return 8;
  }

  return 4;
}

function priceBandScore(sourceProduct?: Product, candidateProduct?: Product) {
  const sourceBand = priceBand(sourceProduct);
  const candidateBand = priceBand(candidateProduct);

  if (!sourceBand || !candidateBand || sourceProduct?.id === candidateProduct?.id) {
    return 0;
  }

  if (sourceBand === candidateBand) {
    return 10;
  }

  return Math.abs(sourceBand - candidateBand) === 1 ? 5 : 0;
}
