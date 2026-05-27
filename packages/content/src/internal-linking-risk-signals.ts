import type { Product } from "@global-import-lab/types";
import { articleTermSet, intersectionCount } from "./internal-linking-article-text-signals";
import { productForArticle } from "./internal-linking-product-signals";
import { riskIntentTokens } from "./internal-linking-taxonomy";
import type { InternalLinkArticle } from "./internal-linking-types";

export function riskProblemOverlap(sourceTerms: Set<string>, candidateTerms: Set<string>) {
  return riskIntentTokens.filter((token) => sourceTerms.has(token) && candidateTerms.has(token)).length;
}

export function riskOverlapScore(source: InternalLinkArticle, candidate: InternalLinkArticle, products: Product[]) {
  const sourceProfile = articleRiskProfile(source, products);
  const candidateProfile = articleRiskProfile(candidate, products);
  return Math.min(20, intersectionCount(sourceProfile, candidateProfile) * 5);
}

export function articleRiskProfile(article: InternalLinkArticle, products: Product[]) {
  const profile = new Set<string>();
  const terms = articleTermSet(article);

  for (const token of riskIntentTokens) {
    if (terms.has(token)) {
      profile.add(token);
    }
  }

  const product = productForArticle(article, products);
  const marketRisk = product?.marketRisks.find((risk) => risk.locale === article.locale);
  if (marketRisk) {
    for (const [key, value] of Object.entries({
      plug: marketRisk.plugRisk,
      customs: marketRisk.customsRisk,
      certification: marketRisk.certificationRisk,
      return: marketRisk.returnRisk
    })) {
      if (value && value !== "low") {
        profile.add(`${key}:${value}`);
      }
    }
  }

  return profile;
}
