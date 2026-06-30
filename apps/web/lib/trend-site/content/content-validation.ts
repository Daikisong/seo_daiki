import type { Article, Product } from "../types";
import { assertSupportedLocale, isIndexableLocale } from "../locales";
import { assertQualityGatePass } from "../quality-gate";
import { getSiteUrl } from "../routes";
import { getArticleEvidenceSource } from "./article-evidence";

export function validateArticleContent(articles: Article[]) {
  for (const article of articles) {
    assertSupportedLocale(article.locale, `${article.id}.locale`);
    if (article.indexStatus === "index" && !isIndexableLocale(article.locale)) {
      throw new Error(`${article.id} uses planned locale ${article.locale}. Mark it noindex until the locale opens.`);
    }
    assertPresent(article.title, `${article.id}.title`);
    assertPresent(article.affiliateDisclosure, `${article.id}.affiliateDisclosure`);
    assertPresent(article.imageUrl, `${article.id}.imageUrl`);
    assertPresent(article.summary, `${article.id}.summary`);
    assertPresent(article.expertCopy.topPicksIntro, `${article.id}.expertCopy.topPicksIntro`);
    assertPresent(article.expertCopy.topPicksRule, `${article.id}.expertCopy.topPicksRule`);
    assertPresent(article.expertCopy.comparisonIntro, `${article.id}.expertCopy.comparisonIntro`);
    assertPresent(article.expertCopy.inDepthHeading, `${article.id}.expertCopy.inDepthHeading`);
    assertPresent(article.expertCopy.topThreeHeading, `${article.id}.expertCopy.topThreeHeading`);
    assertFilledList(article.expertCopy.finalThoughts, `${article.id}.expertCopy.finalThoughts`);
    assertFilledList(article.expertCopy.buyingChecklist, `${article.id}.expertCopy.buyingChecklist`);
    assertFilledList(article.expertCopy.updateLog, `${article.id}.expertCopy.updateLog`);
    assertFilledList(article.evidenceIds, `${article.id}.evidenceIds`);
    assertKnownArticleEvidenceIds(article.evidenceIds, `${article.id}.evidenceIds`);
    if (article.trendSignalBox) {
      assertTrendSignalBox(article.trendSignalBox, `${article.id}.trendSignalBox`);
    }
    if (article.marketplaceRule) {
      assertMarketplaceRule(article.marketplaceRule, `${article.id}.marketplaceRule`);
    }
    if (article.requiresCountryBuyingRoutes) {
      assertFilledArticlePairs(article.countryBuyingRoutes, `${article.id}.countryBuyingRoutes`, "market", "route");
    }
    if (article.requiresAvoidList || (article.avoidList?.length ?? 0) > 0) {
      assertPresent(article.avoidListHeading, `${article.id}.avoidListHeading`);
      assertFilledArticlePairs(article.avoidList, `${article.id}.avoidList`, "label", "reason");
    }
    if (article.sections.length < 3) {
      throw new Error(`${article.id}.sections must include issue bridge, buying checks, and review-signal guidance.`);
    }
    assertQuickAnswerSection(article.sections[0], `${article.id}.sections.0`, article.locale);
    for (const section of article.sections) {
      assertPresent(section.heading, `${article.id}.sections.heading`);
      assertPresent(section.body, `${article.id}.sections.${section.heading}`);
      assertKnownArticleEvidenceIds(section.evidenceIds ?? [], `${article.id}.sections.${section.heading}.evidenceIds`);
    }
    for (const faq of article.faqs) {
      assertPresent(faq.question, `${article.id}.faqs.question`);
      assertPresent(faq.answer, `${article.id}.faqs.${faq.question}`);
    }
  }
}

export function validateProductContent(products: Product[]) {
  for (const product of products) {
    assertPresent(product.merchantUrl, `${product.id}.merchantUrl`);
    assertPresent(product.exactVariant, `${product.id}.exactVariant`);
    assertPresent(product.imageUrl, `${product.id}.imageUrl`);
    assertPresent(product.imageAlt, `${product.id}.imageAlt`);
    assertPresent(product.priceLabel, `${product.id}.priceLabel`);
    assertPresent(product.sourceLabel, `${product.id}.sourceLabel`);
    assertPresent(product.reviewSourceLabel, `${product.id}.reviewSourceLabel`);
    assertPresent(product.marketplaceSourceLabel, `${product.id}.marketplaceSourceLabel`);
    assertPresent(product.priceCheckedAt, `${product.id}.priceCheckedAt`);
    assertPresent(product.regionFit, `${product.id}.regionFit`);
    assertPresent(product.returnRiskLabel, `${product.id}.returnRiskLabel`);
    assertPresent(product.keyCheck, `${product.id}.keyCheck`);
    assertPresent(product.evidenceBasis, `${product.id}.evidenceBasis`);
    assertPresent(product.whyRecommend, `${product.id}.whyRecommend`);
    assertPresent(product.whoFits, `${product.id}.whoFits`);
    assertPresent(product.whoShouldSkip, `${product.id}.whoShouldSkip`);
    assertPresent(product.warrantyReturnNote, `${product.id}.warrantyReturnNote`);
    assertPresent(product.marketplaceNote, `${product.id}.marketplaceNote`);
    assertFilledList(product.repeatedComplaints, `${product.id}.repeatedComplaints`);
    assertFilledList(product.editorialPros, `${product.id}.editorialPros`);
    assertFilledList(product.editorialCons, `${product.id}.editorialCons`);
    assertFilledList(product.keyFeatures, `${product.id}.keyFeatures`);
    if (product.category === "portable air conditioner heatwave cooling") {
      assertPresent(product.productKind, `${product.id}.productKind`);
      assertPresent(product.regionFit, `${product.id}.regionFit`);
      assertPresent(product.coolingCapacity, `${product.id}.coolingCapacity`);
      assertPresent(product.hoseType, `${product.id}.hoseType`);
      assertPresent(product.noiseLevel, `${product.id}.noiseLevel`);
      assertPresent(product.roomSize, `${product.id}.roomSize`);
      assertPresent(product.voltagePlug, `${product.id}.voltagePlug`);
      const firstClaim = product.verifiedClaims[0];
      const firstPrice = product.priceSnapshots[0];
      const firstRisk = product.marketRisks[0];
      assertPresent(firstClaim?.unit, `${product.id}.verifiedClaims.unit`);
      assertPresent(firstPrice?.country, `${product.id}.priceSnapshots.country`);
      assertPresent(firstPrice?.currency, `${product.id}.priceSnapshots.currency`);
      assertPresent(firstRisk?.country, `${product.id}.marketRisks.country`);
    }
  }
}

export function validateQualityGates(articles: Article[], products: Product[]) {
  const siteOrigin = new URL(getSiteUrl()).origin;
  for (const article of articles) {
    assertQualityGatePass(article, products, { allArticles: articles, siteOrigin });
  }
}

function assertTrendSignalBox(value: Article["trendSignalBox"], fieldName: string) {
  if (!value) {
    throw new Error(`${fieldName} is required for issue-led trend articles.`);
  }
  assertPresent(value.heading, `${fieldName}.heading`);
  assertPresent(value.body, `${fieldName}.body`);
  assertFilledArticlePairs(value.items, `${fieldName}.items`, "label", "body");
}

function assertMarketplaceRule(value: Article["marketplaceRule"], fieldName: string) {
  if (!value) {
    throw new Error(`${fieldName} is required for marketplace-risk articles.`);
  }
  assertPresent(value.heading, `${fieldName}.heading`);
  assertPresent(value.body, `${fieldName}.body`);
  assertFilledList(value.bullets, `${fieldName}.bullets`);
}

function assertQuickAnswerSection(value: Article["sections"][number] | undefined, fieldName: string, locale: Article["locale"]) {
  if (!value) {
    throw new Error(`${fieldName} must be the generated Quick answer section.`);
  }
  const isEnglishLocale = locale === "en" || locale.startsWith("en-");
  const hasQuickAnswerRole = value.role === "quick-answer";
  if (!hasQuickAnswerRole && (!isEnglishLocale || normalized(value.heading) !== "quick answer")) {
    throw new Error(`${fieldName} must be marked role: "quick-answer" so localized headings can stay in the page language.`);
  }
  const body = normalized(value.body);
  const englishBridgeTerms = ["buy", "compare", "check", "product", "listing", "seller", "price", "return"];
  if (isEnglishLocale && !englishBridgeTerms.some((term) => body.includes(term))) {
    throw new Error(`${fieldName}.body must bridge the trend issue to a buyer decision.`);
  }
  if (!isEnglishLocale && value.body.trim().length < 80) {
    throw new Error(`${fieldName}.body must contain a localized issue-to-product bridge.`);
  }
}

function assertKnownArticleEvidenceIds(values: string[], fieldName: string) {
  for (const value of values) {
    const source = getArticleEvidenceSource(value);
    if (!source) {
      throw new Error(`${fieldName} contains unknown article evidence id "${value}". Add a source record before publishing.`);
    }
    assertPresent(source.label, `${fieldName}.${value}.label`);
    assertPresent(source.url, `${fieldName}.${value}.url`);
    assertPresent(source.checkedAt, `${fieldName}.${value}.checkedAt`);
    if (!source.url.startsWith("https://")) {
      throw new Error(`${fieldName}.${value}.url must be an HTTPS source URL.`);
    }
  }
}

function assertPresent(value: string | undefined, fieldName: string) {
  if (!value || value.trim().length === 0) {
    throw new Error(`${fieldName} is required. Generate it in the content layer; do not synthesize it in React.`);
  }
}

function normalized(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function assertFilledList(values: string[], fieldName: string) {
  if (values.length === 0) {
    throw new Error(`${fieldName} requires at least one generated item.`);
  }
  for (const value of values) {
    assertPresent(value, fieldName);
  }
}

function assertFilledArticlePairs<T>(
  values: T[] | undefined,
  fieldName: string,
  firstKey: keyof T,
  secondKey: keyof T
) {
  if (!values || values.length === 0) {
    throw new Error(`${fieldName} requires generated reader-facing items.`);
  }
  for (const value of values) {
    const firstValue = value[firstKey];
    const secondValue = value[secondKey];
    assertPresent(typeof firstValue === "string" ? firstValue : undefined, `${fieldName}.${String(firstKey)}`);
    assertPresent(typeof secondValue === "string" ? secondValue : undefined, `${fieldName}.${String(secondKey)}`);
  }
}
