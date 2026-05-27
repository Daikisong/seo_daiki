import type { Product } from "@global-import-lab/types";
import { riskIntentTokens } from "./internal-linking-taxonomy";
import type { InternalLinkArticle } from "./internal-linking-types";

export function productForArticle(article: Pick<InternalLinkArticle, "productId">, products: Product[]) {
  return article.productId ? products.find((product) => product.id === article.productId) : undefined;
}

export function articleCategory(article: InternalLinkArticle, products: Product[]) {
  const productCategory = productForArticle(article, products)?.category;
  if (productCategory) {
    return productCategory;
  }

  const terms = articleText(article);
  if (terms.includes("usb-c") || terms.includes("charger") || terms.includes("cargador") || terms.includes("carregador")) {
    return "usb-c-chargers";
  }

  if (terms.includes("supplement") || terms.includes("iherb") || terms.includes("magnesium") || terms.includes("magnesio")) {
    return "supplements";
  }

  return undefined;
}

export function articleTermSet(article: InternalLinkArticle) {
  return new Set(articleText(article).match(/[a-z0-9]+(?:-[a-z0-9]+)?/g) ?? []);
}

export function priceBand(product?: Product) {
  const finalPrice = product?.priceSnapshots[0]?.finalPrice ?? product?.priceSnapshots[0]?.price;
  if (finalPrice === undefined) {
    return undefined;
  }

  if (finalPrice < 10) {
    return 1;
  }

  if (finalPrice < 25) {
    return 2;
  }

  if (finalPrice < 50) {
    return 3;
  }

  return 4;
}

export function evidenceOverlap(source: InternalLinkArticle, candidate: InternalLinkArticle) {
  const candidateEvidence = new Set(candidate.evidenceIds);
  return source.evidenceIds.filter((evidenceId) => candidateEvidence.has(evidenceId)).length;
}

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

export function intersectionCount<T>(left: Set<T>, right: Set<T>) {
  let count = 0;
  for (const item of left) {
    if (right.has(item)) {
      count += 1;
    }
  }
  return count;
}

function articleText(article: InternalLinkArticle) {
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
