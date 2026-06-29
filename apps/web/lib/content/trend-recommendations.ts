import type { Article, Product } from "@global-import-lab/types";

export interface TrendRecommendation {
  rank: number;
  sourceProductId: string;
  name: string;
  bestFor: string;
  keyCheck: string;
  price: string;
  badge?: string;
  visual: string;
  imageIndex: number;
  evidenceIds: string[];
  pros: string[];
  cons: string[];
  take: string;
  href: string;
  rel: string;
}

export interface TrendRecommendationModel {
  eligible: boolean;
  score: number;
  reasons: string[];
  recommendations: TrendRecommendation[];
}

const COMMERCIAL_TERMS = [
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
  ["mejor", 9],
  ["comprar", 9],
  ["comprador", 8],
  ["precio", 8],
  ["comparar", 9],
  ["resena", 8],
  ["guia", 5],
  ["oferta", 8],
  ["cargador", 8],
  ["viaje", 5],
  ["melhor", 9],
  ["compras", 8],
  ["preco", 8],
  ["comparativo", 9],
  ["carregador", 8],
  ["viagem", 5]
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
  ["school closing", 12]
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
  "plus"
]);

export function buildTrendRecommendations(article: Article, products: Product[]): TrendRecommendation[] {
  return buildTrendRecommendationModel(article, products).recommendations;
}

export function buildTrendRecommendationModel(article: Article, products: Product[]): TrendRecommendationModel {
  const scoredProducts = scoreProductsForArticle(article, products);
  const commerceScore = weightedTermScore(articleSearchText(article), COMMERCIAL_TERMS, 60);
  const riskPenalty = weightedTermScore(articleSearchText(article), INFORMATIONAL_RISK_TERMS, 60);
  const productScore = Math.min(scoredProducts[0]?.score ?? 0, 30);
  const evidenceScore = evidenceFitScore(article, scoredProducts.map((item) => item.product));
  const affiliateScore = affiliateFitScore(article);
  const score = Math.max(0, commerceScore + productScore + evidenceScore + affiliateScore - riskPenalty);
  const recommendationProducts = recommendationReadyProducts(scoredProducts.map((item) => item.product));
  const eligible =
    score >= 45 &&
    productScore >= 10 &&
    recommendationProducts.length >= 10 &&
    uniqueProductAffiliateHrefCount(article, recommendationProducts.slice(0, 10)) >= 10 &&
    riskPenalty <= commerceScore + productScore;
  const reasons = commerceReasons({ commerceScore, productScore, evidenceScore, affiliateScore, riskPenalty, eligible });

  if (!eligible) {
    return {
      eligible,
      score,
      reasons,
      recommendations: []
    };
  }

  return {
    eligible,
    score,
    reasons,
    recommendations: buildRecommendationItems(article, recommendationProducts)
  };
}

function buildRecommendationItems(article: Article, products: Product[]): TrendRecommendation[] {
  return products.slice(0, 10).map((product, index) => {
    const price = product.priceSnapshots[0];
    const verified = product.verifiedClaims[0];
    const risk = product.marketRisks.find((item) => item.locale === article.locale) ?? product.marketRisks[0];
    const review = product.reviewSignals.find((item) => item.locale === article.locale) ?? product.reviewSignals[0];
    return {
      rank: index + 1,
      sourceProductId: product.id,
      name: product.canonicalName,
      bestFor: bestForProduct(product, index),
      keyCheck: verified ? `${verified.resultValue} ${verified.unit ?? ""}`.trim() : risk?.certificationRisk ?? "Exact SKU",
      price: price ? formatPrice(price.currency, price.finalPrice ?? price.price) : "Check live price",
      visual: product.canonicalName ? String(index + 1) : "1",
      imageIndex: index + 1,
      evidenceIds: productEvidenceIds(product),
      pros: productPros(product, verified, price, review),
      cons: productCons(product, risk),
      take: productTake(product, verified, price, risk),
      href: productAffiliateHref(article, product),
      rel: "sponsored nofollow",
      badge: "Evidence record"
    };
  });
}

function scoreProductsForArticle(article: Article, products: Product[]) {
  return products
    .map((product) => ({ product, score: productRelevanceScore(article, product) }))
    .filter((item) => item.score >= 10 && hasTopicalProductOverlap(article, item.product))
    .sort((first, second) => second.score - first.score);
}

function productRelevanceScore(article: Article, product: Product) {
  const articleText = articleSearchText(article);
  const articleTokens = tokenSet(articleText);
  const productText = normalizeText(`${product.canonicalName} ${product.category}`);
  const productTokens = productText
    .split(" ")
    .map(stemToken)
    .filter((token) => token.length >= 3 && !PRODUCT_TOKEN_STOPWORDS.has(token));

  let score = normalizeText(articleText).includes(normalizeText(product.canonicalName)) ? 18 : 0;

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
  const evidenceReadyCount = recommendationReadyProducts(relevantProducts).length;
  const productEvidence = evidenceReadyCount >= 10 ? 10 : evidenceReadyCount >= 3 ? 6 : evidenceReadyCount > 0 ? 3 : 0;
  return articleEvidence + productEvidence;
}

function affiliateFitScore(article: Article) {
  if (article.affiliateLinks.some((link) => link.placementStatus === "approved" && link.offerStatus !== "inactive")) {
    return 10;
  }
  return article.affiliateLinks.length > 0 ? 6 : 0;
}

function commerceReasons({
  commerceScore,
  productScore,
  evidenceScore,
  affiliateScore,
  riskPenalty,
  eligible
}: {
  commerceScore: number;
  productScore: number;
  evidenceScore: number;
  affiliateScore: number;
  riskPenalty: number;
  eligible: boolean;
}) {
  const reasons = [];

  if (commerceScore >= 25) {
    reasons.push("commercial search intent");
  }
  if (productScore >= 10) {
    reasons.push("matching product evidence");
  }
  if (evidenceScore >= 8) {
    reasons.push("source and evidence checks");
  }
  if (affiliateScore > 0) {
    reasons.push("monetization link available");
  }
  if (riskPenalty > 0) {
    reasons.push(`informational-risk penalty ${riskPenalty}`);
  }
  if (!eligible) {
    reasons.push("recommendations suppressed until 10 product-backed picks are ready");
  }

  return reasons;
}

function weightedTermScore(text: string, terms: readonly (readonly [string, number])[], maxScore: number) {
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
    ...article.affiliateLinks.flatMap((link) => [link.label, link.href])
  ].join(" ");
}

function tokenSet(text: string) {
  return new Set(normalizeText(text).split(" ").map(stemToken).filter(Boolean));
}

function hasTopicalProductOverlap(article: Article, product: Product) {
  const articleTokens = tokenSet(articleSearchText(article));
  const productTokens = normalizeText(`${product.canonicalName} ${product.category} ${product.brandClaim ?? ""}`)
    .split(" ")
    .map(stemToken)
    .filter((token) => token.length >= 3 && !PRODUCT_TOKEN_STOPWORDS.has(token) && token !== "style");

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

function bestForProduct(product: Product, index: number) {
  const category = product.category.replace(/[-_]/g, " ");
  const defaults = [
    "Best overall evidence match",
    "Best value import pick",
    "Best cable or accessory fit",
    "Best local-risk comparison",
    "Best high-output travel backup",
    "Best compact daily-carry pick",
    "Best power-bank pairing",
    "Best kit-completion pick",
    "Best budget verified option",
    "Best premium evidence record"
  ];
  return `${defaults[index] ?? "Best supporting pick"} in ${category}`;
}

function productAffiliateHref(article: Article, product: Product) {
  const articleLink = article.affiliateLinks.find((link) => link.offerStatus !== "inactive");
  if (articleLink?.href.includes("aliexpress.com")) {
    const url = new URL(articleLink.href);
    url.searchParams.set("SearchText", product.canonicalName);
    return url.toString();
  }
  return `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(product.canonicalName)}`;
}

function formatPrice(currency: string, value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency
  }).format(value);
}

function recommendationReadyProducts(products: Product[]) {
  return products.filter(
    (product) =>
      product.id &&
      product.canonicalName &&
      productEvidenceIds(product).length > 0 &&
      product.priceSnapshots.length > 0 &&
      product.marketRisks.length > 0 &&
      product.reviewSignals.length > 0
  );
}

function uniqueProductAffiliateHrefCount(article: Article, products: Product[]) {
  return new Set(products.map((product) => productAffiliateHref(article, product))).size;
}

function productEvidenceIds(product: Product) {
  return [
    ...product.verifiedClaims.map((claim) => claim.id),
    ...product.priceSnapshots.map((snapshot) => snapshot.id),
    ...product.reviewSignals.map((signal) => signal.id),
    ...product.marketRisks.map((risk) => risk.id)
  ].filter(Boolean);
}

function productPros(
  product: Product,
  verified: Product["verifiedClaims"][number] | undefined,
  price: Product["priceSnapshots"][number] | undefined,
  review: Product["reviewSignals"][number] | undefined
) {
  return [
    verified ? `Verified ${verified.testType.replace(/_/g, " ")}: ${verified.resultValue} ${verified.unit ?? ""}`.trim() : "Evidence-backed product record",
    price ? `Recorded landed price context in ${price.country}` : "Price snapshot attached",
    review ? `${review.count} review-signal mentions for ${review.topic}` : `Relevant ${product.category.replace(/[-_]/g, " ")} record`
  ];
}

function productCons(product: Product, risk: Product["marketRisks"][number] | undefined) {
  return [
    risk ? `Certification risk is ${risk.certificationRisk}` : "Local certification should be checked",
    risk ? `Return risk is ${risk.returnRisk}` : "Return path should be checked",
    `${product.brandClaim ?? product.canonicalName} variant must match the evidence record`
  ];
}

function productTake(
  product: Product,
  verified: Product["verifiedClaims"][number] | undefined,
  price: Product["priceSnapshots"][number] | undefined,
  risk: Product["marketRisks"][number] | undefined
) {
  const claim = verified ? `${verified.resultValue} ${verified.unit ?? ""}`.trim() : "the attached evidence";
  const priceText = price ? formatPrice(price.currency, price.finalPrice ?? price.price) : "the live checkout price";
  const riskText = risk ? `${risk.certificationRisk} certification and ${risk.returnRisk} return risk` : "local-risk notes";
  return `${product.canonicalName} stays on the list only while ${claim}, ${priceText}, exact variant, and ${riskText} still match the current listing.`;
}
