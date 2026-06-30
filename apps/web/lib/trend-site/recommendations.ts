import type { Article, Product } from "./types";
import type { EvidenceLevel } from "./types";
import { selectRecommendationCandidateProducts } from "./recommendation-product-selection";

export interface TrendRecommendation {
  rank: number;
  sourceProductId: string;
  name: string;
  exactVariant: string;
  rankLabel: string;
  sourceUrl: string;
  sourceLabel: string;
  reviewSourceUrl: string;
  reviewSourceLabel: string;
  marketplaceSourceLabel: string;
  priceCheckedAt: string;
  imageUrl: string;
  imageAlt: string;
  productKind?: string;
  regionFit: string;
  coolingCapacity?: string;
  hoseType?: string;
  noiseLevel?: string;
  roomSize?: string;
  voltagePlug?: string;
  returnRiskLabel: string;
  evidenceLevel: EvidenceLevel;
  reviewSignalCount: number;
  evidenceBasis: string;
  specSummary: string;
  reviewSummary: string;
  safetyNote: string;
  bestFor: string;
  whyRecommend: string;
  whoFits: string;
  whoShouldSkip: string;
  repeatedComplaints: string[];
  warrantyReturnNote: string;
  marketplaceNote: string;
  keyCheck: string;
  keyFeatures: string[];
  price: string;
  badge?: string;
  imageIndex: number;
  evidenceIds: string[];
  pros: string[];
  cons: string[];
  take: string;
  expertReviewTake: string;
  href: string;
  hrefKind: Product["merchantUrlKind"];
  rel: string;
}

export interface TrendRecommendationModel {
  eligible: boolean;
  score: number;
  recommendations: TrendRecommendation[];
}

const BUYER_DECISION_TERMS = [
  ["top 10", 18],
  ["where to buy", 18],
  ["best", 9],
  ["buy", 9],
  ["buyer", 8],
  ["guide", 5],
  ["review", 8],
  ["reviews", 8],
  ["compare", 9],
  ["comparison", 9],
  ["price", 8],
  ["prices", 8],
  ["deal", 8],
  ["deals", 8],
  ["coupon", 8],
  ["discount", 8],
  ["pick", 7],
  ["picks", 7],
  ["product", 7],
  ["products", 7],
  ["gear", 6],
  ["aliexpress", 12],
  ["amazon", 10],
  ["temu", 8],
  ["charger", 8],
  ["adapter", 7],
  ["cable", 7],
  ["power bank", 8],
  ["air conditioner", 9],
  ["fan", 6],
  ["humidifier", 7],
  ["portable", 5],
  ["travel", 5],
  ["iherb", 8],
] as const;

const INFORMATIONAL_RISK_TERMS = [
  ["accident", 16],
  ["attorney", 14],
  ["lawyer", 14],
  ["lawsuit", 14],
  ["crime", 12],
  ["murder", 18],
  ["war", 14],
  ["election", 14],
  ["vote", 10],
  ["president", 10],
  ["storm", 12],
  ["warning", 10],
  ["weather", 12],
  ["earthquake", 14],
  ["fire", 12],
  ["flood", 12],
  ["death", 18],
  ["died", 18],
  ["health", 12],
  ["medicine", 14],
  ["pregnancy", 14],
  ["tax", 10],
  ["visa", 10],
  ["immigration", 12],
  ["government", 10],
  ["lottery", 10],
  ["school closing", 12],
] as const;

const PRODUCT_TOKEN_STOPWORDS = new Set([
  "and",
  "the",
  "with",
  "for",
  "from",
  "this",
  "that",
  "best",
  "top",
  "new",
  "pro",
  "max",
  "mini",
  "plus",
]);

export function buildTrendRecommendations(
  article: Article,
  products: Product[],
): TrendRecommendation[] {
  return buildTrendRecommendationModel(article, products).recommendations;
}

export function buildTrendRecommendationModel(
  article: Article,
  products: Product[],
): TrendRecommendationModel {
  const candidateProducts = selectRecommendationCandidateProducts(
    article,
    products,
  );
  const scoredProducts = scoreProductsForArticle(article, candidateProducts);
  const buyerDecisionScore = weightedTermScore(
    articleSearchText(article),
    BUYER_DECISION_TERMS,
    60,
  );
  const riskPenalty = weightedTermScore(
    articleSearchText(article),
    INFORMATIONAL_RISK_TERMS,
    60,
  );
  const productScore = Math.min(scoredProducts[0]?.score ?? 0, 30);
  const evidenceScore = evidenceFitScore(
    article,
    scoredProducts.map((item) => item.product),
  );
  const affiliateScore = affiliateFitScore(article);
  const score = Math.max(
    0,
    buyerDecisionScore +
      productScore +
      evidenceScore +
      affiliateScore -
      riskPenalty,
  );
  const recommendationProducts = recommendationReadyProducts(
    scoredProducts.map((item) => item.product),
  );
  const eligible =
    score >= 45 &&
    productScore >= 10 &&
    recommendationProducts.length >= 10 &&
    uniqueProductAffiliateHrefCount(
      article,
      recommendationProducts.slice(0, 10),
    ) >= 10 &&
    riskPenalty <= buyerDecisionScore + productScore;
  if (!eligible) {
    return {
      eligible,
      score,
      recommendations: [],
    };
  }

  return {
    eligible,
    score,
    recommendations: buildRecommendationItems(article, recommendationProducts),
  };
}

function buildRecommendationItems(
  article: Article,
  products: Product[],
): TrendRecommendation[] {
  return products.slice(0, 10).map((product, index) => {
    return {
      rank: index + 1,
      sourceProductId: product.id,
      name: product.canonicalName,
      exactVariant: product.exactVariant,
      rankLabel: product.editorialRankLabel,
      sourceUrl: product.sourceUrl,
      sourceLabel: product.sourceLabel,
      reviewSourceUrl: product.reviewSourceUrl,
      reviewSourceLabel: product.reviewSourceLabel,
      marketplaceSourceLabel: product.marketplaceSourceLabel,
      priceCheckedAt: product.priceCheckedAt,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      productKind: product.productKind,
      regionFit: product.regionFit,
      coolingCapacity: product.coolingCapacity,
      hoseType: product.hoseType,
      noiseLevel: product.noiseLevel,
      roomSize: product.roomSize,
      voltagePlug: product.voltagePlug,
      returnRiskLabel: product.returnRiskLabel,
      evidenceLevel: product.evidenceLevel,
      reviewSignalCount: productReviewSignalCount(product),
      evidenceBasis: product.evidenceBasis,
      specSummary: product.specSummary,
      reviewSummary: product.reviewSummary,
      safetyNote: product.safetyNote,
      bestFor: product.bestFor,
      whyRecommend: product.whyRecommend,
      whoFits: product.whoFits,
      whoShouldSkip: product.whoShouldSkip,
      repeatedComplaints: product.repeatedComplaints,
      warrantyReturnNote: product.warrantyReturnNote,
      marketplaceNote: product.marketplaceNote,
      keyCheck: product.keyCheck,
      keyFeatures: product.keyFeatures,
      price: product.priceLabel,
      imageIndex: index + 1,
      evidenceIds: productEvidenceIds(product),
      pros: product.editorialPros,
      cons: product.editorialCons,
      take: product.expertReviewTake,
      expertReviewTake: product.expertReviewTake,
      href: productAffiliateHref(article, product),
      hrefKind: product.merchantUrlKind,
      rel: "sponsored nofollow",
    };
  });
}

function scoreProductsForArticle(article: Article, products: Product[]) {
  return products
    .map((product, index) => ({
      product,
      score: productRelevanceScore(article, product),
      index,
    }))
    .filter(
      (item) =>
        item.score >= 10 && hasTopicalProductOverlap(article, item.product),
    )
    .sort((first, second) => first.index - second.index);
}

function productRelevanceScore(article: Article, product: Product) {
  const articleText = articleSearchText(article);
  const articleTokens = tokenSet(articleText);
  const productText = normalizeText(
    `${product.canonicalName} ${product.category}`,
  );
  const productTokens = productText
    .split(" ")
    .map(stemToken)
    .filter(
      (token) => token.length >= 3 && !PRODUCT_TOKEN_STOPWORDS.has(token),
    );

  let score = normalizeText(articleText).includes(
    normalizeText(product.canonicalName),
  )
    ? 18
    : 0;

  for (const token of new Set(productTokens)) {
    if (articleTokens.has(token)) {
      score += token.length <= 3 ? 3 : 8;
    }
  }

  if (product.verifiedClaims.length > 0) {
    score += 5;
  }
  if (product.priceSnapshots.length > 0) {
    score += 4;
  }
  if (product.marketRisks.some((item) => item.locale === article.locale)) {
    score += 4;
  }
  if (product.reviewSignals.some((item) => item.locale === article.locale)) {
    score += 3;
  }

  return Math.min(score, 50);
}

function evidenceFitScore(article: Article, relevantProducts: Product[]) {
  const articleEvidence = Math.min(article.evidenceIds.length * 3, 12);
  const evidenceReadyCount =
    recommendationReadyProducts(relevantProducts).length;
  const productEvidence =
    evidenceReadyCount >= 10
      ? 10
      : evidenceReadyCount >= 3
        ? 6
        : evidenceReadyCount > 0
          ? 3
          : 0;
  return articleEvidence + productEvidence;
}

function affiliateFitScore(article: Article) {
  if (
    article.affiliateLinks.some(
      (link) =>
        link.placementStatus === "approved" && link.offerStatus !== "inactive",
    )
  ) {
    return 10;
  }
  return article.affiliateLinks.length > 0 ? 6 : 0;
}

function weightedTermScore(
  text: string,
  terms: readonly (readonly [string, number])[],
  maxScore: number,
) {
  const normalized = normalizeText(text);
  const tokens = tokenSet(text);
  let score = 0;

  for (const [term, weight] of terms) {
    const normalizedTerm = normalizeText(term);
    if (normalizedTerm.includes(" ")) {
      if (normalized.includes(normalizedTerm)) {
        score += weight;
      }
    } else if (tokens.has(stemToken(normalizedTerm))) {
      score += weight;
    }
  }

  return Math.min(score, maxScore);
}

function articleSearchText(article: Article) {
  return [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.affiliateLinks.flatMap((link) => [link.label, link.href]),
  ].join(" ");
}

function tokenSet(text: string) {
  return new Set(normalizeText(text).split(" ").map(stemToken).filter(Boolean));
}

function hasTopicalProductOverlap(article: Article, product: Product) {
  const articleTokens = tokenSet(articleSearchText(article));
  const productTokens = normalizeText(
    `${product.canonicalName} ${product.category} ${product.brandClaim ?? ""}`,
  )
    .split(" ")
    .map(stemToken)
    .filter(
      (token) =>
        token.length >= 3 &&
        !PRODUCT_TOKEN_STOPWORDS.has(token) &&
        token !== "style",
    );

  return productTokens.some((token) => articleTokens.has(token));
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9$]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stemToken(token: string) {
  if (token.length > 3 && token.endsWith("s")) {
    return token.slice(0, -1);
  }
  return token;
}

function productAffiliateHref(article: Article, product: Product) {
  void article;
  return product.merchantUrl;
}

function recommendationReadyProducts(products: Product[]) {
  return products.filter(
    (product) =>
      product.id &&
      product.canonicalName &&
      product.evidenceLevel !== "insufficient" &&
      product.merchantUrl &&
      product.imageUrl &&
      product.priceLabel &&
      product.keyCheck &&
      product.whyRecommend &&
      product.whoFits &&
      product.whoShouldSkip &&
      product.repeatedComplaints.length > 0 &&
      product.warrantyReturnNote &&
      product.marketplaceNote &&
      product.editorialPros.length > 0 &&
      product.editorialCons.length > 0 &&
      product.expertReviewTake &&
      productEvidenceIds(product).length > 0 &&
      product.priceSnapshots.length > 0 &&
      product.marketRisks.length > 0 &&
      product.reviewSignals.length > 0,
  );
}

function uniqueProductAffiliateHrefCount(
  article: Article,
  products: Product[],
) {
  return new Set(
    products.map((product) => productAffiliateHref(article, product)),
  ).size;
}

function productEvidenceIds(product: Product) {
  return [
    ...product.verifiedClaims.map((claim) => claim.id),
    ...product.priceSnapshots.map((snapshot) => snapshot.id),
    ...product.reviewSignals.map((signal) => signal.id),
    ...product.marketRisks.map((risk) => risk.id),
  ].filter(Boolean);
}

function productReviewSignalCount(product: Product) {
  return product.reviewSignals.reduce(
    (total, signal) => total + signal.count,
    0,
  );
}
