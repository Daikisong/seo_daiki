import { articlePath } from "@global-import-lab/seo";
import type { Article, ArticleType, InternalLink, Product } from "@global-import-lab/types";

export type InternalLinkArticle = Pick<
  Article,
  | "contentMdx"
  | "evidenceIds"
  | "h1"
  | "id"
  | "indexStatus"
  | "locale"
  | "metaDescription"
  | "productId"
  | "publishStatus"
  | "sections"
  | "slug"
  | "summary"
  | "title"
  | "type"
> & { group: string };

const linkableArticleTypes: ArticleType[] = [
  "hub",
  "methodology",
  "trend",
  "buyer_guide",
  "deal_watch",
  "ingredient_guide",
  "risk",
  "data",
  "lab",
  "compare",
  "guide",
  "review"
];

const linkReasonByType: Record<ArticleType, InternalLink["reason"]> = {
  hub: "category_hub",
  methodology: "methodology",
  data: "data",
  lab: "data",
  compare: "compare",
  guide: "guide",
  risk: "risk",
  review: "alternative",
  trend: "trend",
  buyer_guide: "guide",
  deal_watch: "deal",
  ingredient_guide: "ingredient"
};

const riskIntentTokens = [
  "variant",
  "sku",
  "option",
  "plug",
  "enchufe",
  "plugue",
  "cable",
  "customs",
  "impuesto",
  "iva",
  "tax",
  "certification",
  "ce",
  "return",
  "devolucion",
  "devolução",
  "shipping",
  "frete",
  "price",
  "precio",
  "preço",
  "watts",
  "watt",
  "output",
  "potencia",
  "potência",
  "thermal",
  "heat",
  "laptop",
  "capacity",
  "torque",
  "zigbee"
];

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
    reason: linkReasonByType[candidate.type]
  }));

  return ensureMinimumInternalLinks(article, links, linkableCandidates, limit);
}

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

function sortScoredInternalLinks(
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
      reason: linkReasonByType[candidate.type]
    }));

  return dedupeInternalLinks([...deduped, ...fallbackLinks]).slice(0, limit);
}

function productForArticle(article: Pick<InternalLinkArticle, "productId">, products: Product[]) {
  return article.productId ? products.find((product) => product.id === article.productId) : undefined;
}

function articleCategory(article: InternalLinkArticle, products: Product[]) {
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

function articleTermSet(article: InternalLinkArticle) {
  return new Set(articleText(article).match(/[a-z0-9]+(?:-[a-z0-9]+)?/g) ?? []);
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

function evidenceOverlap(source: InternalLinkArticle, candidate: InternalLinkArticle) {
  const candidateEvidence = new Set(candidate.evidenceIds);
  return source.evidenceIds.filter((evidenceId) => candidateEvidence.has(evidenceId)).length;
}

function riskProblemOverlap(sourceTerms: Set<string>, candidateTerms: Set<string>) {
  return riskIntentTokens.filter((token) => sourceTerms.has(token) && candidateTerms.has(token)).length;
}

function riskOverlapScore(source: InternalLinkArticle, candidate: InternalLinkArticle, products: Product[]) {
  const sourceProfile = articleRiskProfile(source, products);
  const candidateProfile = articleRiskProfile(candidate, products);
  return Math.min(20, intersectionCount(sourceProfile, candidateProfile) * 5);
}

function articleRiskProfile(article: InternalLinkArticle, products: Product[]) {
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

function priceBand(product?: Product) {
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

function typeAffinityScore(source: InternalLinkArticle, candidate: InternalLinkArticle) {
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

function intersectionCount<T>(left: Set<T>, right: Set<T>) {
  let count = 0;
  for (const item of left) {
    if (right.has(item)) {
      count += 1;
    }
  }
  return count;
}
