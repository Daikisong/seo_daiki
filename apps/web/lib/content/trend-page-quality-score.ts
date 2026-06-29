import type { Article, Product } from "@global-import-lab/types";
import {
  buildTrendRecommendationModel,
  type TrendRecommendationModel
} from "./trend-recommendations";

export const TREND_PAGE_QUALITY_SCORE_GATE = 98;

export type TrendPageQualityIssueSeverity = "info" | "warning" | "blocking";

export interface TrendPageQualityIssue {
  code: string;
  message: string;
  severity: TrendPageQualityIssueSeverity;
}

export interface TrendPageQualityBreakdown {
  answerFirstSections: number;
  freshnessEvidence: number;
  commerceGate: number;
  recommendationReadiness: number;
  itemListReadiness: number;
  affiliateDisclosureReadiness: number;
  internalLinks: number;
  topicRiskControl: number;
  benchmarkStructureReadiness: number;
  penalties: number;
}

export interface TrendPageBenchmarkSections {
  answerFirst: boolean;
  trendBackdata: boolean;
  selectionMethod: boolean;
  comparisonTable: boolean;
  inDepthReviews: boolean;
  finalVerdict: boolean;
  faq: boolean;
  editorialMethod: boolean;
}

export interface TrendPageQualityScore {
  score: number;
  gate: number;
  passedGate: boolean;
  sergAliBenchmarkReady: boolean;
  benchmarkStructureReady: boolean;
  benchmarkSections: TrendPageBenchmarkSections;
  itemListReady: boolean;
  top3Ready: boolean;
  top10Ready: boolean;
  recommendationModel: TrendRecommendationModel;
  breakdown: TrendPageQualityBreakdown;
  issues: TrendPageQualityIssue[];
  strengths: string[];
}

export interface TrendPageQualityScoreOptions {
  now?: string | Date;
}

const ANSWER_FIRST_TERMS = [
  "answer",
  "quick answer",
  "verdict",
  "best",
  "top pick",
  "what to buy",
  "recommendation",
  "start with",
  "choose",
  "avoid"
] as const;

const INFORMATIONAL_RISK_TERMS = [
  ["attorney", 14],
  ["court", 10],
  ["crime", 12],
  ["death", 18],
  ["election", 12],
  ["emergency", 12],
  ["evacuation", 14],
  ["flood", 12],
  ["government", 8],
  ["health", 12],
  ["immigration", 12],
  ["law", 10],
  ["lawsuit", 14],
  ["lawyer", 14],
  ["legal", 10],
  ["medical", 14],
  ["storm", 12],
  ["tax", 10],
  ["warning", 10],
  ["weather", 12]
] as const;

const MONETIZATION_TERMS = ["affiliate", "buy", "coupon", "deal", "discount", "sponsored"] as const;

export function buildTrendPageQualityScore(
  article: Article,
  products: Product[],
  options: TrendPageQualityScoreOptions = {}
): TrendPageQualityScore {
  const recommendationModel = buildTrendRecommendationModel(article, products);
  const relevantProducts = productsWithEvidence(products);
  const answerFirstSections = answerFirstScore(article);
  const freshnessEvidence = freshnessEvidenceScore(article, relevantProducts, options.now);
  const commerceGate = commerceGateScore(article, recommendationModel);
  const recommendationReadiness = recommendationReadinessScore(recommendationModel, products);
  const itemListReadiness = itemListReadinessScore(article, recommendationModel);
  const affiliateDisclosureReadiness = affiliateDisclosureReadinessScore(article, recommendationModel);
  const internalLinks = internalLinksScore(article);
  const topicRiskControl = topicRiskControlScore(article);
  const penalties = penaltyScore(article, recommendationModel);
  const productBackedCount = productBackedRecommendationCount(recommendationModel, products);
  const fallbackCount = fallbackRecommendationCount(recommendationModel);
  const uniqueHrefCount = uniqueRecommendationHrefCount(recommendationModel);
  const top3Ready = recommendationModel.eligible && productBackedCount >= 3 && fallbackCount === 0;
  const top10Ready = recommendationModel.eligible && productBackedCount >= 10 && fallbackCount === 0;
  const itemListReady = itemListReadiness >= 8 && top10Ready && uniqueHrefCount >= 10;
  const benchmarkStructure = benchmarkStructureScore({
    article,
    products,
    recommendationModel,
    answerFirstSections,
    top10Ready,
    itemListReady
  });
  const benchmarkStructureReadiness = benchmarkStructure.score;
  const benchmarkStructureReady = Object.values(benchmarkStructure.sections).every(Boolean);
  const rawScore =
    answerFirstSections +
    freshnessEvidence +
    commerceGate +
    recommendationReadiness +
    itemListReadiness +
    affiliateDisclosureReadiness +
    internalLinks +
    topicRiskControl +
    benchmarkStructureReadiness -
    penalties;
  const score = clampScore(rawScore);
  const issues = qualityIssues({
    article,
    recommendationModel,
    answerFirstSections,
    freshnessEvidence,
    affiliateDisclosureReadiness,
    internalLinks,
    penalties,
    top3Ready,
    top10Ready,
    itemListReady,
    productBackedCount,
    fallbackCount,
    uniqueHrefCount,
    benchmarkStructureReady,
    benchmarkSections: benchmarkStructure.sections
  });
  const sergAliBenchmarkReady =
    score >= TREND_PAGE_QUALITY_SCORE_GATE &&
    recommendationModel.eligible &&
    top3Ready &&
    top10Ready &&
    itemListReady &&
    benchmarkStructureReady &&
    affiliateDisclosureReadiness >= 8 &&
    riskTermPenalty(article) < 12;

  return {
    score,
    gate: TREND_PAGE_QUALITY_SCORE_GATE,
    passedGate: sergAliBenchmarkReady,
    sergAliBenchmarkReady,
    benchmarkStructureReady,
    benchmarkSections: benchmarkStructure.sections,
    itemListReady,
    top3Ready,
    top10Ready,
    recommendationModel,
    breakdown: {
      answerFirstSections,
      freshnessEvidence,
      commerceGate,
      recommendationReadiness,
      itemListReadiness,
      affiliateDisclosureReadiness,
      internalLinks,
      topicRiskControl,
      benchmarkStructureReadiness,
      penalties
    },
    issues,
    strengths: qualityStrengths({
      answerFirstSections,
      freshnessEvidence,
      commerceGate,
      recommendationReadiness,
      itemListReadiness,
      affiliateDisclosureReadiness,
      internalLinks,
      topicRiskControl,
      benchmarkStructureReadiness
    })
  };
}

export const scoreTrendPageQuality = buildTrendPageQualityScore;

function answerFirstScore(article: Article) {
  const firstSection = article.sections[0];
  if (!firstSection) {
    return 0;
  }

  let score = 4;
  const headingText = normalizeText(firstSection.heading);
  const bodyText = normalizeText(`${firstSection.body} ${article.summary}`);

  if (ANSWER_FIRST_TERMS.some((term) => headingText.includes(normalizeText(term)))) {
    score += 4;
  }
  if (ANSWER_FIRST_TERMS.some((term) => bodyText.includes(normalizeText(term)))) {
    score += 4;
  }
  if (firstSection.body.trim().length >= 120 || article.summary.trim().length >= 120) {
    score += 3;
  }

  return Math.min(score, 15);
}

function freshnessEvidenceScore(article: Article, products: Product[], nowInput?: string | Date) {
  let score = 0;
  const lastUpdated = parseDate(article.lastUpdated);
  const now = parseDate(nowInput ?? new Date());

  if (lastUpdated) {
    score += 5;
    const ageDays = now ? daysBetween(lastUpdated, now) : undefined;
    if (ageDays !== undefined && ageDays <= 30) {
      score += 5;
    } else if (ageDays !== undefined && ageDays <= 90) {
      score += 3;
    } else if (ageDays !== undefined && ageDays <= 180) {
      score += 2;
    } else {
      score += 1;
    }
  }

  score += article.evidenceIds.length >= 3 ? 4 : article.evidenceIds.length > 0 ? 2 : 0;

  const sectionEvidenceCount = article.sections.reduce((count, section) => count + (section.evidenceIds?.length ?? 0), 0);
  score += sectionEvidenceCount >= 3 ? 3 : sectionEvidenceCount > 0 ? 1 : 0;

  const evidenceProductCount = products.filter((product) => hasProductEvidence(product)).length;
  score += evidenceProductCount >= 3 ? 3 : evidenceProductCount > 0 ? 2 : 0;

  return Math.min(score, 20);
}

function commerceGateScore(article: Article, recommendationModel: TrendRecommendationModel) {
  let score = article.type === "trend" ? 2 : 0;

  if (recommendationModel.eligible) {
    score += 10;
  } else if (recommendationModel.score >= 30) {
    score += 4;
  }

  if (recommendationModel.score >= 70) {
    score += 3;
  } else if (recommendationModel.score >= 45) {
    score += 2;
  }

  return Math.min(score, 15);
}

function recommendationReadinessScore(recommendationModel: TrendRecommendationModel, products: Product[]) {
  if (!recommendationModel.eligible) {
    return 0;
  }

  const recommendations = recommendationModel.recommendations;
  const productBackedCount = productBackedRecommendationCount(recommendationModel, products);
  const fallbackCount = fallbackRecommendationCount(recommendationModel);
  let score = 0;

  if (productBackedCount >= 3 && fallbackCount === 0) {
    score += 6;
  }
  if (productBackedCount >= 10 && fallbackCount === 0) {
    score += 6;
  }

  score += productBackedCount >= 10 ? 4 : productBackedCount >= 3 ? 2 : 0;

  if (
    recommendations.length > 0 &&
    recommendations.every(
      (item, index) =>
        item.rank === index + 1 &&
        item.sourceProductId &&
        item.name &&
        item.bestFor &&
        item.keyCheck &&
        item.evidenceIds.length > 0 &&
        item.badge !== "Needs review"
    )
  ) {
    score += 2;
  }

  return Math.min(score, 18);
}

function itemListReadinessScore(article: Article, recommendationModel: TrendRecommendationModel) {
  let score = article.type === "trend" ? 1 : 0;
  const recommendations = recommendationModel.recommendations;

  if (recommendationModel.eligible && recommendations.length >= 3 && fallbackRecommendationCount(recommendationModel) === 0) {
    score += 3;
  }
  if (
    recommendations.length >= 10 &&
    recommendations.every((item) => item.sourceProductId && item.name && item.href && item.evidenceIds.length > 0)
  ) {
    score += 2;
  }
  if (uniqueRecommendationHrefCount(recommendationModel) >= 10) {
    score += 1;
  }
  if (recommendations.every((item, index) => item.rank === index + 1)) {
    score += 1;
  }

  return Math.min(score, 8);
}

function affiliateDisclosureReadinessScore(article: Article, recommendationModel: TrendRecommendationModel) {
  const links = article.affiliateLinks;
  if (links.length === 0) {
    return recommendationModel.eligible ? 6 : 0;
  }

  let score = 3;
  const activeLinks = links.filter((link) => link.offerStatus !== "inactive" && link.offerStatus !== "expired");

  if (activeLinks.some((link) => link.placementStatus === "approved")) {
    score += 2;
  }
  if (activeLinks.every((link) => relIncludes(link.rel, "sponsored") && relIncludes(link.rel, "nofollow"))) {
    score += 2;
  }
  if (activeLinks.some((link) => link.disclosureShown)) {
    score += 2;
  } else if (recommendationModel.eligible) {
    score += 1;
  }
  if (activeLinks.every((link) => !link.offerHealthSensitive)) {
    score += 1;
  }

  return Math.min(score, 10);
}

function benchmarkStructureScore({
  article,
  products,
  recommendationModel,
  answerFirstSections,
  top10Ready,
  itemListReady
}: {
  article: Article;
  products: Product[];
  recommendationModel: TrendRecommendationModel;
  answerFirstSections: number;
  top10Ready: boolean;
  itemListReady: boolean;
}) {
  const totals = productEvidenceTotals(products, article.locale);
  const reasonSet = new Set(article.internalLinks.map((link) => link.reason));
  const recommendations = recommendationModel.recommendations;
  const answerFirst = answerFirstSections >= 10;
  const trendBackdata =
    article.evidenceIds.length >= 3 &&
    totals.evidenceProductCount >= 3 &&
    totals.verifiedClaims >= 3 &&
    totals.priceSnapshots >= 3 &&
    totals.reviewSignals >= 3;
  const selectionMethod =
    recommendationModel.eligible &&
    article.sections.length >= 3 &&
    (reasonSet.has("methodology") || reasonSet.has("data") || reasonSet.has("risk"));
  const comparisonTable = top10Ready && itemListReady;
  const inDepthReviews =
    recommendations.length >= 10 &&
    recommendations.every(
      (item) =>
        item.sourceProductId &&
        item.badge !== "Needs review" &&
        item.name &&
        item.bestFor &&
        item.keyCheck &&
        item.price &&
        item.take &&
        item.evidenceIds.length > 0 &&
        item.pros.length >= 2 &&
        item.cons.length >= 2
    );
  const finalVerdict = answerFirst && Boolean(recommendations[0]?.name);
  const faq = trendBackdata && Boolean(article.lastUpdated) && totals.localRiskRows > 0;
  const editorialMethod =
    article.evidenceIds.length >= 3 &&
    products.length >= 3 &&
    (reasonSet.has("methodology") || reasonSet.has("data") || reasonSet.has("risk"));
  const sections: TrendPageBenchmarkSections = {
    answerFirst,
    trendBackdata,
    selectionMethod,
    comparisonTable,
    inDepthReviews,
    finalVerdict,
    faq,
    editorialMethod
  };
  const score =
    (answerFirst ? 2 : 0) +
    (trendBackdata ? 3 : 0) +
    (selectionMethod ? 2 : 0) +
    (comparisonTable ? 2 : 0) +
    (inDepthReviews ? 2 : 0) +
    (finalVerdict ? 1 : 0) +
    (faq ? 1 : 0) +
    (editorialMethod ? 2 : 0);

  return { score, sections };
}

function internalLinksScore(article: Article) {
  const links = article.internalLinks;
  if (links.length === 0) {
    return 0;
  }

  let score = 2;
  if (links.length >= 3) {
    score += 2;
  }
  if (new Set(links.map((link) => link.reason)).size >= 2) {
    score += 2;
  }
  if (links.every((link) => link.href.startsWith(`/${article.locale}/`) || link.href.startsWith("/global/"))) {
    score += 1;
  }
  if (links.some((link) => ["category_hub", "data", "guide", "methodology", "risk"].includes(link.reason))) {
    score += 1;
  }

  return Math.min(score, 8);
}

function topicRiskControlScore(article: Article) {
  let score = 0;

  if (riskTermPenalty(article) === 0) {
    score += 4;
  }
  if (!article.healthSensitivity || article.healthSensitivity === "none" || article.healthSensitivity === "low") {
    score += 1;
  }
  if (!article.complianceStatus || article.complianceStatus === "unchecked" || article.complianceStatus === "passed") {
    score += 1;
  }

  return Math.min(score, 6);
}

function penaltyScore(article: Article, recommendationModel: TrendRecommendationModel) {
  let penalty = riskTermPenalty(article);
  const activeAffiliateLinks = article.affiliateLinks.filter(
    (link) => link.offerStatus !== "inactive" && link.offerStatus !== "expired"
  );

  if (activeAffiliateLinks.length > 5) {
    penalty += Math.min((activeAffiliateLinks.length - 5) * 3, 12);
  }
  if (activeAffiliateLinks.length > article.sections.length + 2) {
    penalty += 6;
  }
  if (activeAffiliateLinks.length > 0 && !activeAffiliateLinks.some((link) => link.disclosureShown)) {
    penalty += 5;
  }
  if (activeAffiliateLinks.some((link) => !relIncludes(link.rel, "sponsored") || !relIncludes(link.rel, "nofollow"))) {
    penalty += 4;
  }
  if (article.healthSensitivity === "medium") {
    penalty += 6;
  } else if (article.healthSensitivity === "high") {
    penalty += 10;
  }
  if (article.complianceStatus === "manual_required") {
    penalty += 5;
  } else if (article.complianceStatus === "blocked") {
    penalty += 10;
  }
  if (!recommendationModel.eligible && activeAffiliateLinks.length > 0) {
    penalty += 8;
  }

  const monetizationMentions = countTermMentions(articleSearchText(article), MONETIZATION_TERMS);
  if (monetizationMentions >= 14 && article.evidenceIds.length < 3) {
    penalty += 6;
  }

  return Math.min(penalty, 45);
}

function qualityIssues({
  article,
  recommendationModel,
  answerFirstSections,
  freshnessEvidence,
  affiliateDisclosureReadiness,
  internalLinks,
  penalties,
  top3Ready,
  top10Ready,
  itemListReady,
  productBackedCount,
  fallbackCount,
  uniqueHrefCount,
  benchmarkStructureReady,
  benchmarkSections
}: {
  article: Article;
  recommendationModel: TrendRecommendationModel;
  answerFirstSections: number;
  freshnessEvidence: number;
  affiliateDisclosureReadiness: number;
  internalLinks: number;
  penalties: number;
  top3Ready: boolean;
  top10Ready: boolean;
  itemListReady: boolean;
  productBackedCount: number;
  fallbackCount: number;
  uniqueHrefCount: number;
  benchmarkStructureReady: boolean;
  benchmarkSections: TrendPageBenchmarkSections;
}) {
  const issues: TrendPageQualityIssue[] = [];

  if (answerFirstSections < 10) {
    issues.push({
      code: "answer_first_missing",
      message: "The opening section should give a direct answer before the trend context.",
      severity: "warning"
    });
  }
  if (freshnessEvidence < 14) {
    issues.push({
      code: "freshness_evidence_weak",
      message: "Fresh date, article evidence IDs, section evidence, or product evidence are weak.",
      severity: "warning"
    });
  }
  if (!recommendationModel.eligible) {
    issues.push({
      code: "commerce_gate_failed",
      message: "The current trend recommendation model does not consider this page eligible for commerce recommendations.",
      severity: "blocking"
    });
  }
  if (!top3Ready) {
    issues.push({
      code: "top_3_not_ready",
      message: "Top 3 recommendation slots are not ready.",
      severity: "blocking"
    });
  }
  if (!top10Ready) {
    issues.push({
      code: "top_10_not_ready",
      message: "Top 10 recommendation slots need 10 product-backed picks with no placeholders.",
      severity: "blocking"
    });
  }
  if (productBackedCount < 10) {
    issues.push({
      code: "recommendations_not_product_backed",
      message: `Only ${productBackedCount} recommendation slots are backed by product evidence.`,
      severity: "blocking"
    });
  }
  if (fallbackCount > 0) {
    issues.push({
      code: "fallback_recommendations_present",
      message: "Placeholder or Needs review picks cannot pass the top-tier review gate.",
      severity: "blocking"
    });
  }
  if (uniqueHrefCount < 10 && recommendationModel.recommendations.length > 0) {
    issues.push({
      code: "recommendation_links_not_unique",
      message: `Only ${uniqueHrefCount} unique recommendation links are available for the Top 10 list.`,
      severity: "blocking"
    });
  }
  if (!itemListReady) {
    issues.push({
      code: "item_list_not_ready",
      message: "ItemList output is not ready for the trend recommendations.",
      severity: "blocking"
    });
  }
  if (!benchmarkStructureReady) {
    const missing = Object.entries(benchmarkSections)
      .filter(([, ready]) => !ready)
      .map(([section]) => section)
      .join(", ");
    issues.push({
      code: "benchmark_structure_incomplete",
      message: `SergAli-style review structure is incomplete: ${missing}.`,
      severity: "blocking"
    });
  }
  if (article.affiliateLinks.length > 0 && affiliateDisclosureReadiness < 8) {
    issues.push({
      code: "affiliate_disclosure_weak",
      message: "Affiliate links need approved status, sponsored nofollow rel, and disclosure readiness.",
      severity: "warning"
    });
  }
  if (internalLinks < 5) {
    issues.push({
      code: "internal_links_weak",
      message: "The page needs stronger internal links to guides, data, methodology, risk, or hub pages.",
      severity: "warning"
    });
  }
  if (riskTermPenalty(article) > 0) {
    issues.push({
      code: "informational_risk_topic",
      message: "Weather, legal, health, government, or emergency intent reduces monetized benchmark readiness.",
      severity: "blocking"
    });
  }
  if (penalties >= 12) {
    issues.push({
      code: "penalty_load_high",
      message: "Risk or monetization penalties are high enough to suppress benchmark readiness.",
      severity: "blocking"
    });
  }

  return issues;
}

function qualityStrengths(breakdown: Omit<TrendPageQualityBreakdown, "penalties">) {
  const strengths: string[] = [];

  if (breakdown.answerFirstSections >= 12) {
    strengths.push("answer-first opening");
  }
  if (breakdown.freshnessEvidence >= 17) {
    strengths.push("fresh date and evidence coverage");
  }
  if (breakdown.commerceGate >= 13) {
    strengths.push("commerce gate passed");
  }
  if (breakdown.recommendationReadiness >= 16) {
    strengths.push("Top 3 and Top 10 recommendations ready");
  }
  if (breakdown.itemListReadiness >= 7) {
    strengths.push("ItemList-ready recommendations");
  }
  if (breakdown.affiliateDisclosureReadiness >= 8) {
    strengths.push("affiliate disclosure ready");
  }
  if (breakdown.internalLinks >= 6) {
    strengths.push("internal links ready");
  }
  if (breakdown.topicRiskControl >= 6) {
    strengths.push("low informational-risk profile");
  }
  if (breakdown.benchmarkStructureReadiness >= 13) {
    strengths.push("SergAli-style review structure ready");
  }

  return strengths;
}

function productBackedRecommendationCount(recommendationModel: TrendRecommendationModel, products: Product[]) {
  const productIds = new Set(products.map((product) => product.id));
  const productNames = new Set(products.map((product) => normalizeText(product.canonicalName)));
  return recommendationModel.recommendations.filter(
    (item) =>
      item.badge === "Evidence record" &&
      item.evidenceIds.length > 0 &&
      (productIds.has(item.sourceProductId) || productNames.has(normalizeText(item.name)))
  ).length;
}

function fallbackRecommendationCount(recommendationModel: TrendRecommendationModel) {
  return recommendationModel.recommendations.filter(
    (item) => item.badge === "Needs review" || !item.sourceProductId || item.evidenceIds.length === 0
  ).length;
}

function uniqueRecommendationHrefCount(recommendationModel: TrendRecommendationModel) {
  return new Set(recommendationModel.recommendations.map((item) => item.href).filter(Boolean)).size;
}

function riskTermPenalty(article: Article) {
  return weightedTermScore(articleSearchText(article), INFORMATIONAL_RISK_TERMS, 30);
}

function productsWithEvidence(products: Product[]) {
  return products.filter((product) => hasProductEvidence(product));
}

function productEvidenceTotals(products: Product[], locale: string) {
  return {
    evidenceProductCount: productsWithEvidence(products).length,
    verifiedClaims: products.reduce((count, product) => count + product.verifiedClaims.length, 0),
    priceSnapshots: products.reduce((count, product) => count + product.priceSnapshots.length, 0),
    reviewSignals: products.reduce((count, product) => count + product.reviewSignals.length, 0),
    localRiskRows: products.reduce(
      (count, product) => count + product.marketRisks.filter((risk) => risk.locale === locale).length,
      0
    )
  };
}

function hasProductEvidence(product: Product) {
  return (
    product.verifiedClaims.length > 0 ||
    product.priceSnapshots.length > 0 ||
    product.marketRisks.length > 0 ||
    product.reviewSignals.length > 0
  );
}

function relIncludes(rel: string, value: string) {
  return rel.split(/\s+/).includes(value);
}

function weightedTermScore(text: string, terms: readonly (readonly [string, number])[], maxScore: number) {
  const normalized = normalizeText(text);
  const tokens = new Set(normalized.split(" ").filter(Boolean));
  let score = 0;

  for (const [term, weight] of terms) {
    const normalizedTerm = normalizeText(term);
    if (normalizedTerm.includes(" ")) {
      if (normalized.includes(normalizedTerm)) {
        score += weight;
      }
    } else if (tokens.has(normalizedTerm)) {
      score += weight;
    }
  }

  return Math.min(score, maxScore);
}

function countTermMentions(text: string, terms: readonly string[]) {
  const normalized = normalizeText(text);
  return terms.reduce((count, term) => {
    const pattern = new RegExp(`\\b${escapeRegExp(normalizeText(term))}\\b`, "g");
    return count + (normalized.match(pattern)?.length ?? 0);
  }, 0);
}

function articleSearchText(article: Article) {
  return [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.affiliateLinks.map((link) => link.label)
  ].join(" ");
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

function parseDate(input: string | Date) {
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function daysBetween(from: Date, to: Date) {
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86_400_000));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}
