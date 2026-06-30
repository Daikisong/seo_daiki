import { isIndexableLocale, localeToHtmlLang } from "./locales";
import { selectRecommendationCandidateProducts } from "./recommendation-product-selection";
import { buildTrendRecommendationModel } from "./recommendations";
import {
  isDirectHttpsOutbound,
  isMarketplaceSearchUrl,
} from "./quality-gate-url-rules";
import type { Article, Product } from "./types";

export type QualityGateStatus =
  | "PASS"
  | "REPAIR_REQUIRED"
  | "HOLD_SOURCE_INSUFFICIENT"
  | "HOLD_HREFLANG_INCOMPLETE"
  | "HOLD_LEGAL_OR_YMYL_REVIEW";

export type QualityGateSeverity = "hard" | "repair" | "hold";

export type QualityGateBlocker = {
  code: string;
  target: string;
  severity: QualityGateSeverity;
  message: string;
  repairAction: string;
};

export type QualityGateResult = {
  articleId: string;
  status: QualityGateStatus;
  canPublishIndexable: boolean;
  hardGate: {
    passed: boolean;
    blockers: QualityGateBlocker[];
  };
  repairGate: {
    passed: boolean;
    blockers: QualityGateBlocker[];
  };
  editorialGate: {
    passed: boolean;
    blockers: QualityGateBlocker[];
  };
  hreflangGate: {
    passed: boolean;
    clusterAction: "none" | "cluster" | "hold";
    blockers: QualityGateBlocker[];
  };
  nextStep:
    | "PUBLISH"
    | "RUN_RESEARCH_REPAIR_LOOP"
    | "HOLD_FOR_SOURCE"
    | "HOLD_FOR_HREFLANG"
    | "HOLD_FOR_LEGAL_REVIEW";
};

type QualityGateContext = {
  allArticles?: Article[];
  siteOrigin?: string;
};

const DIRECT_USE_CLAIM_PATTERNS = [
  /\b(i|we|jacob)\s+(personally\s+)?(tested|installed|monitored|handled|reviewed\s+hands-on)\b/i,
  /\b(i|we|jacob)\s+(personally\s+)?used\s+(this|the|it|product|unit|charger|air conditioner|ac|pick|model)\b/i,
  /\bjacob'?s\s+(hands-on|real-world|personal)\s+(test|testing|use|review)\b/i,
  /\b(hands-on|personal)\s+(tested|testing|use|review)\b/i,
  /\btesting\s+(?:the\s+)?(?:unit|product|model|charger|air conditioner|ac|pick)\b/i,
  /\bfirst-hand\s+(?:use|testing|review|evaluation|experience)\b/i,
  /\btested\s+in\s+(?:our|the)\s+lab\b/i,
  /\bhands-on\s+evaluation\b/i,
  /\bwe\s+ran\s+hands-on\s+checks\b/i,
  /\blab-tested\b/i,
  /\btested\s+for\s+(?:\d+\s+)?(?:days?|weeks?|months?)\b/i,
  /\bpersonally\s+used\s+for\s+(?:a|\d+)\s+(?:days?|weeks?|months?)\b/i,
  /\bpersonally\s+tested\b/i,
] as const;

const FORBIDDEN_INTERNAL_PROCESS_PATTERNS = [
  /\bsearch intent\b/i,
  /\bevidence fit\b/i,
  /\blocal risk\b/i,
  /\bbackdata\b/i,
  /\bcommercial search intent\b/i,
  /\bSERP analysis\b/i,
  /\bsource and evidence checks\b/i,
  /\bmonetization link available\b/i,
  /\bmonetization availability\b/i,
  /\bSERP provider\b/i,
  /\bSERP checked\b/i,
  /\bprovider checks\b/i,
  /\bprovider signals\b/i,
  /\branking data\b/i,
  /\branked products by\b/i,
  /\bevidence quality\b/i,
  /\bsource stack\b/i,
  /\bevidence note\b/i,
  /\brecommendation strength\b/i,
  /\bSEO workflow\b/i,
  /\bSearch Console\b/i,
  /\bLLM signals?\b/i,
  /\bLLM evidence\b/i,
  /\bSEO checked\b/i,
  /\bfollowed Google helpful content guidance\b/i,
] as const;

export function runArticleQualityGate(
  article: Article,
  allProducts: Product[],
  context: QualityGateContext = {},
): QualityGateResult {
  const products = selectRecommendationCandidateProducts(article, allProducts);
  const hardBlockers: QualityGateBlocker[] = [];
  const repairBlockers: QualityGateBlocker[] = [];
  const editorialBlockers: QualityGateBlocker[] = [];
  const hreflangBlockers: QualityGateBlocker[] = [];

  if (article.indexStatus === "index" && !isIndexableLocale(article.locale)) {
    hardBlockers.push(
      blocker(
        "LOCALE_NOT_OPEN",
        article.id,
        "hard",
        `Locale ${article.locale} is not open for indexing.`,
        "Mark the article noindex or open the locale in the central locale config before publishing.",
      ),
    );
  }

  if (
    article.indexStatus === "index" &&
    !article.productCategory &&
    allProducts.some((product) => product.productRole === "main")
  ) {
    hardBlockers.push(
      blocker(
        "MISSING_PRODUCT_CATEGORY",
        article.id,
        "hard",
        "Indexable commerce articles must declare productCategory before recommendations can render.",
        "Set productCategory to the exact generated recommendation category, or keep the page noindex until product matching is explicit.",
      ),
    );
  }

  const publicText = articleTextForQuality(article, products);
  if (hasForbiddenInternalProcessCopy(publicText)) {
    hardBlockers.push(
      blocker(
        "FORBIDDEN_INTERNAL_PROCESS_COPY",
        article.id,
        "hard",
        "Public article copy exposes internal SEO, SERP, Search Console, monetization, or LLM workflow language.",
        "Remove internal workflow proof text and rewrite it as buyer-facing outcomes, checks, warnings, or product decisions.",
      ),
    );
  }

  if (
    article.indexStatus === "index" &&
    article.locale !== "en" &&
    !looksLikeLocale(publicText, article.locale)
  ) {
    hardBlockers.push(
      blocker(
        "LANGUAGE_LOCALE_MISMATCH",
        article.id,
        "hard",
        `Localized article body does not look like ${localeToHtmlLang(article.locale)} public copy.`,
        "Generate localized title, body, product cards, FAQ, schema text, and UI labels for the target locale before publishing.",
      ),
    );
  }

  if (
    (article.affiliateLinks.length > 0 || products.length > 0) &&
    !article.affiliateDisclosure.trim()
  ) {
    hardBlockers.push(
      blocker(
        "MISSING_AFFILIATE_DISCLOSURE",
        article.id,
        "hard",
        "Affiliate article is missing a concise near-top disclosure.",
        "Add reader-facing affiliate disclosure near the article intro.",
      ),
    );
  }

  for (const link of article.affiliateLinks) {
    if (!hasSponsoredNofollow(link.rel)) {
      hardBlockers.push(
        blocker(
          "UNQUALIFIED_AFFILIATE_LINK",
          `${article.id}:${link.label}`,
          "hard",
          "Affiliate link is missing sponsored/nofollow rel.",
          "Set rel to include sponsored and nofollow.",
        ),
      );
    }
    if (!isDirectHttpsOutbound(link.href, context)) {
      hardBlockers.push(
        blocker(
          "INVALID_AFFILIATE_HREF",
          `${article.id}:${link.label}`,
          "hard",
          "Affiliate link is not a direct HTTPS outbound URL.",
          "Use the merchant or affiliate deep link as href and keep analytics separate.",
        ),
      );
    }
    if (
      isMarketplaceSearchUrl(link.href) &&
      link.linkType !== "marketplace-search-route"
    ) {
      hardBlockers.push(
        blocker(
          "UNCLASSIFIED_SEARCH_ROUTE",
          `${article.id}:${link.label}`,
          "hard",
          "Marketplace search URLs must not be presented as exact affiliate/product deep links.",
          "Mark the link as marketplace-search-route or replace it with an approved exact product deep link.",
        ),
      );
    }
  }

  if (!article.trendSignalBox) {
    repairBlockers.push(
      blocker(
        "MISSING_TREND_SIGNAL_BOX",
        article.id,
        "repair",
        "Article is missing a trend signal box.",
        "Add detected trend, locale/context, timing, buyer risk, and article response.",
      ),
    );
  }

  if (
    (article.affiliateLinks.length > 0 || products.length > 0) &&
    !article.marketplaceRule
  ) {
    repairBlockers.push(
      blocker(
        "MISSING_MARKETPLACE_RULE",
        article.id,
        "repair",
        "Affiliate article is missing marketplace route guidance.",
        "Explain when AliExpress, Temu, Amazon, iHerb, or local retailers make sense for this buyer problem.",
      ),
    );
  }

  if (
    needsCountryBuyingRoutes(article) &&
    (!article.countryBuyingRoutes || article.countryBuyingRoutes.length === 0)
  ) {
    repairBlockers.push(
      blocker(
        "MISSING_COUNTRY_BUYING_ROUTES",
        article.id,
        "repair",
        "Region-led article is missing country buying routes.",
        "Add localized retailer, currency, delivery, return, voltage, and warranty routes for the target region.",
      ),
    );
  }

  if (
    needsAvoidList(article) &&
    (!article.avoidListHeading ||
      !article.avoidList ||
      article.avoidList.length === 0)
  ) {
    repairBlockers.push(
      blocker(
        "MISSING_AVOID_LIST",
        article.id,
        "repair",
        "Confusing-category article is missing an avoid list.",
        "Add buyer-facing products or listing types the reader should not confuse with the recommended category.",
      ),
    );
  }

  if (article.expertCopy.updateLog.length === 0) {
    hardBlockers.push(
      blocker(
        "MISSING_UPDATE_LOG",
        article.id,
        "hard",
        "Article has no update log.",
        "Generate an update log before publishing.",
      ),
    );
  }

  if (article.sections.length < 3) {
    repairBlockers.push(
      blocker(
        "ARTICLE_TOO_THIN",
        article.id,
        "repair",
        "Article lacks enough buyer-decision sections.",
        "Add quick answer, buyer-problem translation, comparison guidance, and risk/avoidance sections.",
      ),
    );
  }

  if (article.faqs.length < 3) {
    repairBlockers.push(
      blocker(
        "FAQ_TOO_THIN",
        article.id,
        "repair",
        "Article has fewer than three FAQ entries.",
        "Add buyer questions that clarify use case, marketplace route, risk, and alternatives.",
      ),
    );
  }

  if (article.productCategory && products.length === 0) {
    hardBlockers.push(
      blocker(
        "NO_RECOMMENDATION_PRODUCTS",
        article.id,
        "hard",
        "Article product category has no product evidence records.",
        "Collect product candidates and evidence ledger items before publishing.",
      ),
    );
  }

  if (article.productCategory) {
    const recommendationModel = buildTrendRecommendationModel(
      article,
      allProducts,
    );
    if (
      !recommendationModel.eligible ||
      recommendationModel.recommendations.length < 10
    ) {
      hardBlockers.push(
        blocker(
          "TOP10_RECOMMENDATION_MODEL_NOT_READY",
          article.id,
          "hard",
          "Article product category does not produce ten renderable main recommendations.",
          "Generate at least ten ready, unique, main-product records with direct outbound CTAs before publishing the Top 10 article.",
        ),
      );
    }
  }

  for (const product of products) {
    checkProductHardGates(product, hardBlockers, context);
    checkProductRepairGates(
      article,
      product,
      repairBlockers,
      editorialBlockers,
    );
  }

  checkDirectUseClaims(article, products, hardBlockers);

  if (article.localization?.clusterId) {
    const variants = (context.allArticles ?? []).filter(
      (candidate) =>
        candidate.localization?.clusterId === article.localization?.clusterId,
    );
    if (variants.length < 2) {
      hreflangBlockers.push(
        blocker(
          "HREFLANG_CLUSTER_INCOMPLETE",
          article.localization.clusterId,
          "hold",
          "Hreflang cluster has fewer than two complete variants.",
          "Remove the cluster id or add complete reciprocal localized variants.",
        ),
      );
    }
    for (const variant of variants) {
      if (
        variant.indexStatus !== "index" ||
        variant.publishStatus !== "published" ||
        !isIndexableLocale(variant.locale)
      ) {
        hreflangBlockers.push(
          blocker(
            "HREFLANG_VARIANT_NOT_INDEXABLE",
            variant.id,
            "hold",
            "Hreflang variant is not complete, published, and indexable.",
            "Keep the page out of the cluster until it is publishable.",
          ),
        );
      }
    }
  }

  for (const other of context.allArticles ?? []) {
    if (
      other.id === article.id ||
      other.locale === article.locale ||
      other.indexStatus !== "index"
    ) {
      continue;
    }
    const sameCategory = Boolean(
      article.productCategory &&
      article.productCategory === other.productCategory,
    );
    const sameCluster = Boolean(
      article.localization?.clusterId &&
      article.localization.clusterId === other.localization?.clusterId,
    );
    if (
      sameCategory &&
      !sameCluster &&
      textSimilarity(
        articleTextForQuality(article, products),
        articleTextForQuality(other, allProducts),
      ) > 0.82
    ) {
      editorialBlockers.push(
        blocker(
          "HIGH_DOORWAY_SIMILARITY",
          `${article.id}:${other.id}`,
          "repair",
          "Two locale pages look too similar without being a valid localized hreflang cluster.",
          "Rewrite the localized buyer problem, retailers, risks, product routes, review signals, and marketplace notes before publishing both pages.",
        ),
      );
    }
  }

  return qualityGateResult(
    article.id,
    hardBlockers,
    repairBlockers,
    editorialBlockers,
    hreflangBlockers,
  );
}

export function assertQualityGatePass(
  article: Article,
  products: Product[],
  context: QualityGateContext = {},
) {
  const result = runArticleQualityGate(article, products, context);
  if (result.status !== "PASS") {
    const details = [
      ...result.hardGate.blockers,
      ...result.repairGate.blockers,
      ...result.editorialGate.blockers,
      ...result.hreflangGate.blockers,
    ]
      .map(
        (item) =>
          `${item.code} (${item.target}): ${item.message} Repair: ${item.repairAction}`,
      )
      .join("\n");
    throw new Error(`${article.id} quality gate ${result.status}\n${details}`);
  }
}

function checkProductHardGates(
  product: Product,
  blockers: QualityGateBlocker[],
  context: QualityGateContext,
) {
  const requiredFields: Array<[string, string]> = [
    ["exactVariant", product.exactVariant],
    ["merchantUrl", product.merchantUrl],
    ["merchantUrlKind", product.merchantUrlKind],
    ["sourceUrl", product.sourceUrl],
    ["sourceLabel", product.sourceLabel],
    ["reviewSourceUrl", product.reviewSourceUrl],
    ["reviewSourceLabel", product.reviewSourceLabel],
    ["marketplaceSourceLabel", product.marketplaceSourceLabel],
    ["priceCheckedAt", product.priceCheckedAt],
    ["priceState", product.priceState],
    ["evidenceLevel", product.evidenceLevel],
    ["evidenceBasis", product.evidenceBasis],
    ["bestFor", product.bestFor],
    ["whyRecommend", product.whyRecommend],
    ["whoFits", product.whoFits],
    ["whoShouldSkip", product.whoShouldSkip],
    ["regionFit", product.regionFit],
    ["returnRiskLabel", product.returnRiskLabel],
    ["warrantyReturnNote", product.warrantyReturnNote],
    ["marketplaceNote", product.marketplaceNote],
    ["specSummary", product.specSummary],
    ["reviewSummary", product.reviewSummary],
    ["safetyNote", product.safetyNote],
    ["expertReviewTake", product.expertReviewTake],
  ];

  for (const [field, value] of requiredFields) {
    if (!value.trim()) {
      blockers.push(
        blocker(
          "MISSING_PRODUCT_FIELD",
          `${product.id}.${field}`,
          "hard",
          `Product is missing ${field}.`,
          "Generate the field in the evidence/content layer before publishing.",
        ),
      );
    }
  }

  if (!isDirectHttpsOutbound(product.merchantUrl, context)) {
    blockers.push(
      blocker(
        "FRAGILE_PRODUCT_HREF",
        product.id,
        "hard",
        "Product CTA URL is not a direct HTTPS merchant or affiliate URL.",
        "Use a validated merchant/affiliate deep link as href and keep analytics separate.",
      ),
    );
  }

  if (
    product.merchantUrlKind !== "marketplace-search-route" &&
    isMarketplaceSearchUrl(product.merchantUrl)
  ) {
    blockers.push(
      blocker(
        "UNCLASSIFIED_SEARCH_ROUTE",
        product.id,
        "hard",
        "Search-result URLs cannot be used as exact product or price CTAs.",
        "Replace with an exact product/affiliate deep link, or explicitly mark the URL as marketplace-search-route so the UI labels it as a listing search.",
      ),
    );
  }

  if (
    !isDirectHttpsOutbound(product.sourceUrl) ||
    !isDirectHttpsOutbound(product.reviewSourceUrl)
  ) {
    blockers.push(
      blocker(
        "INVALID_PRODUCT_SOURCE_URL",
        product.id,
        "hard",
        "Product source URLs must be valid HTTPS URLs.",
        "Replace missing or invalid source URLs before publishing.",
      ),
    );
  }

  const requiredCollections: Array<[string, unknown[]]> = [
    ["repeatedComplaints", product.repeatedComplaints],
    ["editorialPros", product.editorialPros],
    ["editorialCons", product.editorialCons],
    ["keyFeatures", product.keyFeatures],
    ["verifiedClaims", product.verifiedClaims],
    ["priceSnapshots", product.priceSnapshots],
    ["reviewSignals", product.reviewSignals],
    ["marketRisks", product.marketRisks],
  ];

  for (const [field, values] of requiredCollections) {
    if (values.length === 0) {
      blockers.push(
        blocker(
          "MISSING_PRODUCT_EVIDENCE_COLLECTION",
          `${product.id}.${field}`,
          "hard",
          `Product is missing ${field}.`,
          "Generate this evidence/content collection before publishing.",
        ),
      );
    }
  }

  validateProductEvidenceEntries(product, blockers);

  if (product.evidenceLevel === "insufficient") {
    blockers.push(
      blocker(
        "INSUFFICIENT_PRODUCT_EVIDENCE",
        product.id,
        "hard",
        "Insufficient-evidence product cannot be recommended.",
        "Replace the product or downgrade it to a non-recommended mention.",
      ),
    );
  }

  if (
    product.evidenceLevel === "direct-use" &&
    !product.verifiedClaims.some((claim) => claim.testType === "direct-use")
  ) {
    blockers.push(
      blocker(
        "DIRECT_USE_WITHOUT_EVIDENCE",
        product.id,
        "hard",
        "Direct-use product has no direct-use evidence claim.",
        "Attach direct-use evidence or lower the evidence level.",
      ),
    );
  }
}

function checkProductRepairGates(
  article: Article,
  product: Product,
  repairBlockers: QualityGateBlocker[],
  editorialBlockers: QualityGateBlocker[],
) {
  if (product.repeatedComplaints.length < 3) {
    repairBlockers.push(
      blocker(
        "REPEATED_COMPLAINTS_TOO_THIN",
        product.id,
        "repair",
        "Product has fewer than three repeated complaint checks.",
        "Add product-specific low-star or buyer-friction patterns.",
      ),
    );
  }

  if (article.productCategory === "portable air conditioner heatwave cooling") {
    const coolingFields: Array<[string, string | undefined]> = [
      ["productKind", product.productKind],
      ["coolingCapacity", product.coolingCapacity],
      ["hoseType", product.hoseType],
      ["noiseLevel", product.noiseLevel],
      ["roomSize", product.roomSize],
      ["voltagePlug", product.voltagePlug],
    ];
    for (const [field, value] of coolingFields) {
      if (!value?.trim()) {
        repairBlockers.push(
          blocker(
            "MISSING_CATEGORY_DECISION_FIELD",
            `${product.id}.${field}`,
            "repair",
            `Cooling comparison is missing ${field}.`,
            "Add category-specific comparison data before publishing.",
          ),
        );
      }
    }
  }

  if (
    normalized(product.specSummary) === normalized(product.expertReviewTake)
  ) {
    editorialBlockers.push(
      blocker(
        "THIN_AFFILIATE_PRODUCT_COPY",
        product.id,
        "repair",
        "Product take repeats the spec summary too closely.",
        "Rewrite the expert take around buyer fit, risk, and repeated complaints.",
      ),
    );
  }
}

function checkDirectUseClaims(
  article: Article,
  products: Product[],
  blockers: QualityGateBlocker[],
) {
  const articleText = [
    article.summary,
    article.trendSignalBox?.heading,
    article.trendSignalBox?.body,
    article.trendSignalBox?.sourceNote,
    ...(article.trendSignalBox?.items.flatMap((item) => [
      item.label,
      item.body,
    ]) ?? []),
    article.marketplaceRule?.heading,
    article.marketplaceRule?.body,
    ...(article.marketplaceRule?.bullets ?? []),
    ...(article.countryBuyingRoutes?.flatMap((route) => [
      route.market,
      route.route,
    ]) ?? []),
    ...(article.avoidList?.flatMap((item) => [item.label, item.reason]) ?? []),
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...articleExpertCopyText(article),
  ].join(" ");

  if (
    hasDirectUseClaim(articleText) &&
    !products.every(hasCompleteDirectUseEvidence)
  ) {
    blockers.push(
      blocker(
        "UNSUPPORTED_DIRECT_USE_CLAIM",
        article.id,
        "hard",
        "Article copy appears to claim Jacob directly tested or used products without complete direct-use evidence for every selected recommendation.",
        "Remove the claim or attach direct-use evidence with exact variant, usage window, and original notes to every product covered by the claim.",
      ),
    );
  }

  for (const product of products) {
    const productText = [
      product.evidenceBasis,
      product.specSummary,
      product.reviewSummary,
      product.safetyNote,
      product.whyRecommend,
      product.whoFits,
      product.whoShouldSkip,
      ...product.repeatedComplaints,
      product.warrantyReturnNote,
      product.marketplaceNote,
      product.expertReviewTake,
      ...product.editorialPros,
      ...product.editorialCons,
    ].join(" ");

    if (
      hasDirectUseClaim(productText) &&
      !hasCompleteDirectUseEvidence(product)
    ) {
      blockers.push(
        blocker(
          "UNSUPPORTED_DIRECT_USE_PRODUCT_CLAIM",
          product.id,
          "hard",
          "Product copy appears to claim direct use without direct-use evidence for that exact product.",
          "Remove the claim or attach direct-use evidence to this product's exact variant.",
        ),
      );
    }
  }
}

function validateProductEvidenceEntries(
  product: Product,
  blockers: QualityGateBlocker[],
) {
  product.verifiedClaims.forEach((claim, index) => {
    requireEvidenceField(
      claim.id,
      `${product.id}.verifiedClaims.${index}.id`,
      blockers,
    );
    requireEvidenceField(
      claim.productId,
      `${product.id}.verifiedClaims.${index}.productId`,
      blockers,
    );
    requireEvidenceProductId(
      claim.productId,
      product.id,
      `${product.id}.verifiedClaims.${index}.productId`,
      blockers,
    );
    requireEvidenceField(
      claim.testType,
      `${product.id}.verifiedClaims.${index}.testType`,
      blockers,
    );
    requireEvidenceField(
      claim.resultValue,
      `${product.id}.verifiedClaims.${index}.resultValue`,
      blockers,
    );
    if (claim.testType === "direct-use") {
      requireEvidenceField(
        claim.exactVariant,
        `${product.id}.verifiedClaims.${index}.exactVariant`,
        blockers,
      );
      requireEvidenceField(
        claim.usageWindow,
        `${product.id}.verifiedClaims.${index}.usageWindow`,
        blockers,
      );
      requireEvidenceField(
        claim.originalNote,
        `${product.id}.verifiedClaims.${index}.originalNote`,
        blockers,
      );
      if (claim.exactVariant && claim.exactVariant !== product.exactVariant) {
        blockers.push(
          blocker(
            "DIRECT_USE_VARIANT_MISMATCH",
            `${product.id}.verifiedClaims.${index}.exactVariant`,
            "hard",
            "Direct-use evidence variant does not match the recommended exact variant.",
            "Attach direct-use evidence to the exact product variant named in the public recommendation.",
          ),
        );
      }
    }
  });

  product.priceSnapshots.forEach((snapshot, index) => {
    requireEvidenceField(
      snapshot.id,
      `${product.id}.priceSnapshots.${index}.id`,
      blockers,
    );
    requireEvidenceField(
      snapshot.productId,
      `${product.id}.priceSnapshots.${index}.productId`,
      blockers,
    );
    requireEvidenceProductId(
      snapshot.productId,
      product.id,
      `${product.id}.priceSnapshots.${index}.productId`,
      blockers,
    );
    requireEvidenceField(
      snapshot.country,
      `${product.id}.priceSnapshots.${index}.country`,
      blockers,
    );
    requireEvidenceField(
      snapshot.currency,
      `${product.id}.priceSnapshots.${index}.currency`,
      blockers,
    );
    requireEvidenceField(
      snapshot.priceLabel,
      `${product.id}.priceSnapshots.${index}.priceLabel`,
      blockers,
    );
    requireEvidenceField(
      snapshot.priceState,
      `${product.id}.priceSnapshots.${index}.priceState`,
      blockers,
    );
    if (snapshot.price === 0) {
      blockers.push(
        blocker(
          "PRICE_PLACEHOLDER_ZERO",
          `${product.id}.priceSnapshots.${index}.price`,
          "hard",
          "Price snapshot uses 0 as a placeholder.",
          "Use null with priceState unavailable, range, or search-route when live price is not known.",
        ),
      );
    } else if (
      snapshot.priceState === "checked" &&
      (snapshot.price === null ||
        !Number.isFinite(snapshot.price) ||
        snapshot.price <= 0)
    ) {
      blockers.push(
        blocker(
          "MISSING_NUMERIC_CHECKED_PRICE",
          `${product.id}.priceSnapshots.${index}.price`,
          "hard",
          "Checked price snapshots need a positive numeric price.",
          "Store the checked live price as a positive number, or change priceState and priceLabel if the price is unavailable or only a search route.",
        ),
      );
    } else if (
      snapshot.price !== null &&
      (!Number.isFinite(snapshot.price) || snapshot.price < 0)
    ) {
      blockers.push(
        blocker(
          "MISSING_PRODUCT_EVIDENCE_FIELD",
          `${product.id}.priceSnapshots.${index}.price`,
          "hard",
          "Price snapshot is missing a valid numeric price.",
          "Store a positive numeric price or null with an explicit priceState.",
        ),
      );
    }
  });

  product.reviewSignals.forEach((signal, index) => {
    requireEvidenceField(
      signal.id,
      `${product.id}.reviewSignals.${index}.id`,
      blockers,
    );
    requireEvidenceField(
      signal.productId,
      `${product.id}.reviewSignals.${index}.productId`,
      blockers,
    );
    requireEvidenceProductId(
      signal.productId,
      product.id,
      `${product.id}.reviewSignals.${index}.productId`,
      blockers,
    );
    requireEvidenceField(
      signal.locale,
      `${product.id}.reviewSignals.${index}.locale`,
      blockers,
    );
    requireEvidenceField(
      signal.topic,
      `${product.id}.reviewSignals.${index}.topic`,
      blockers,
    );
    if (!Number.isFinite(signal.count) || signal.count <= 0) {
      blockers.push(
        blocker(
          "MISSING_PRODUCT_EVIDENCE_FIELD",
          `${product.id}.reviewSignals.${index}.count`,
          "hard",
          "Review signal is missing a positive count.",
          "Store the review/comment count used for the repeated-complaint summary.",
        ),
      );
    }
  });

  product.marketRisks.forEach((risk, index) => {
    requireEvidenceField(
      risk.id,
      `${product.id}.marketRisks.${index}.id`,
      blockers,
    );
    requireEvidenceField(
      risk.productId,
      `${product.id}.marketRisks.${index}.productId`,
      blockers,
    );
    requireEvidenceProductId(
      risk.productId,
      product.id,
      `${product.id}.marketRisks.${index}.productId`,
      blockers,
    );
    requireEvidenceField(
      risk.locale,
      `${product.id}.marketRisks.${index}.locale`,
      blockers,
    );
    requireEvidenceField(
      risk.country,
      `${product.id}.marketRisks.${index}.country`,
      blockers,
    );
    requireEvidenceField(
      risk.certificationRisk,
      `${product.id}.marketRisks.${index}.certificationRisk`,
      blockers,
    );
    requireEvidenceField(
      risk.returnRisk,
      `${product.id}.marketRisks.${index}.returnRisk`,
      blockers,
    );
  });
}

function requireEvidenceField(
  value: string | undefined,
  target: string,
  blockers: QualityGateBlocker[],
) {
  if (!value?.trim()) {
    blockers.push(
      blocker(
        "MISSING_PRODUCT_EVIDENCE_FIELD",
        target,
        "hard",
        "Product evidence entry is missing a required field.",
        "Fill this evidence subfield before publishing the product recommendation.",
      ),
    );
  }
}

function requireEvidenceProductId(
  value: string,
  productId: string,
  target: string,
  blockers: QualityGateBlocker[],
) {
  if (value && value !== productId) {
    blockers.push(
      blocker(
        "PRODUCT_EVIDENCE_ID_MISMATCH",
        target,
        "hard",
        "Product evidence entry is attached to a different product id.",
        "Regenerate the evidence row so productId matches the recommended product id.",
      ),
    );
  }
}

function hasCompleteDirectUseEvidence(product: Product) {
  return (
    product.evidenceLevel === "direct-use" &&
    product.verifiedClaims.some(
      (claim) =>
        claim.testType === "direct-use" &&
        claim.exactVariant === product.exactVariant &&
        Boolean(claim.usageWindow?.trim()) &&
        Boolean(claim.originalNote?.trim()),
    )
  );
}

function qualityGateResult(
  articleId: string,
  hardBlockers: QualityGateBlocker[],
  repairBlockers: QualityGateBlocker[],
  editorialBlockers: QualityGateBlocker[],
  hreflangBlockers: QualityGateBlocker[],
): QualityGateResult {
  const status = statusForBlockers(
    hardBlockers,
    repairBlockers,
    editorialBlockers,
    hreflangBlockers,
  );
  return {
    articleId,
    status,
    canPublishIndexable: status === "PASS",
    hardGate: { passed: hardBlockers.length === 0, blockers: hardBlockers },
    repairGate: {
      passed: repairBlockers.length === 0,
      blockers: repairBlockers,
    },
    editorialGate: {
      passed: editorialBlockers.length === 0,
      blockers: editorialBlockers,
    },
    hreflangGate: {
      passed: hreflangBlockers.length === 0,
      clusterAction: hreflangBlockers.length > 0 ? "hold" : "none",
      blockers: hreflangBlockers,
    },
    nextStep: nextStepForStatus(status),
  };
}

function statusForBlockers(
  hardBlockers: QualityGateBlocker[],
  repairBlockers: QualityGateBlocker[],
  editorialBlockers: QualityGateBlocker[],
  hreflangBlockers: QualityGateBlocker[],
): QualityGateStatus {
  if (hreflangBlockers.length > 0) {
    return "HOLD_HREFLANG_INCOMPLETE";
  }
  if (
    hardBlockers.some(
      (item) =>
        item.code.includes("SOURCE") ||
        item.code.includes("EVIDENCE") ||
        item.code.includes("PRODUCT"),
    )
  ) {
    return "HOLD_SOURCE_INSUFFICIENT";
  }
  if (
    hardBlockers.length > 0 ||
    repairBlockers.length > 0 ||
    editorialBlockers.length > 0
  ) {
    return "REPAIR_REQUIRED";
  }
  return "PASS";
}

function nextStepForStatus(
  status: QualityGateStatus,
): QualityGateResult["nextStep"] {
  switch (status) {
    case "PASS":
      return "PUBLISH";
    case "HOLD_SOURCE_INSUFFICIENT":
      return "HOLD_FOR_SOURCE";
    case "HOLD_HREFLANG_INCOMPLETE":
      return "HOLD_FOR_HREFLANG";
    case "HOLD_LEGAL_OR_YMYL_REVIEW":
      return "HOLD_FOR_LEGAL_REVIEW";
    case "REPAIR_REQUIRED":
      return "RUN_RESEARCH_REPAIR_LOOP";
  }
}

function blocker(
  code: string,
  target: string,
  severity: QualityGateSeverity,
  message: string,
  repairAction: string,
): QualityGateBlocker {
  return { code, target, severity, message, repairAction };
}

function hasSponsoredNofollow(rel: string) {
  const tokens = new Set(rel.toLowerCase().split(/\s+/).filter(Boolean));
  return tokens.has("sponsored") && tokens.has("nofollow");
}

function hasForbiddenInternalProcessCopy(value: string) {
  return FORBIDDEN_INTERNAL_PROCESS_PATTERNS.some((pattern) =>
    pattern.test(value),
  );
}

function hasDirectUseClaim(value: string) {
  return DIRECT_USE_CLAIM_PATTERNS.some((pattern) => pattern.test(value));
}

function needsCountryBuyingRoutes(article: Article) {
  if (article.requiresCountryBuyingRoutes || article.targetRegion?.trim()) {
    return true;
  }
  return /\b(europe|united kingdom|uk|germany|france|italy|spain|korea|japan|taiwan|hong kong|brazil|netherlands|poland|sweden|turkey|thailand|vietnam)\b/i.test(
    `${article.title} ${article.h1} ${article.summary}`,
  );
}

function needsAvoidList(article: Article) {
  if (article.requiresAvoidList) {
    return true;
  }
  const text = normalized(
    `${article.title} ${article.h1} ${article.summary} ${article.productCategory ?? ""}`,
  );
  return (
    text.includes("portable air conditioner") ||
    text.includes("portable ac") ||
    text.includes("air cooler") ||
    text.includes("fake wattage") ||
    text.includes("wrong-voltage") ||
    text.includes("confuse")
  );
}

function normalized(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function articleTextForQuality(article: Article, products: Product[] = []) {
  return [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.affiliateDisclosure,
    article.trendSignalBox?.heading,
    article.trendSignalBox?.body,
    article.trendSignalBox?.sourceNote,
    ...(article.trendSignalBox?.items.flatMap((item) => [
      item.label,
      item.body,
    ]) ?? []),
    article.marketplaceRule?.heading,
    article.marketplaceRule?.body,
    ...(article.marketplaceRule?.bullets ?? []),
    ...(article.countryBuyingRoutes?.flatMap((route) => [
      route.market,
      route.route,
    ]) ?? []),
    ...(article.avoidList?.flatMap((item) => [item.label, item.reason]) ?? []),
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
    ...articleExpertCopyText(article),
    ...products.flatMap((product) => [
      product.canonicalName,
      product.exactVariant,
      product.priceLabel,
      product.regionFit,
      product.returnRiskLabel,
      product.evidenceBasis,
      product.specSummary,
      product.reviewSummary,
      product.safetyNote,
      product.bestFor,
      product.whyRecommend,
      product.whoFits,
      product.whoShouldSkip,
      product.warrantyReturnNote,
      product.marketplaceNote,
      product.expertReviewTake,
      ...product.repeatedComplaints,
      ...product.editorialPros,
      ...product.editorialCons,
    ]),
  ].join(" ");
}

function articleExpertCopyText(article: Article) {
  return [
    article.expertCopy.topPicksHeading,
    article.expertCopy.topPicksIntro,
    article.expertCopy.topPicksRule,
    article.expertCopy.comparisonHeading,
    article.expertCopy.comparisonIntro,
    article.expertCopy.comparisonFootnote,
    article.expertCopy.inDepthHeading,
    article.expertCopy.topThreeHeading,
    article.expertCopy.finalThoughtsHeading,
    ...article.expertCopy.finalThoughts,
    article.expertCopy.buyingChecklistHeading,
    ...article.expertCopy.buyingChecklist,
    article.expertCopy.updateLogHeading,
    ...article.expertCopy.updateLog,
  ];
}

function looksLikeLocale(value: string, locale: Article["locale"]) {
  if (locale === "en" || locale.startsWith("en-")) {
    return true;
  }
  if (looksMostlyEnglish(value)) {
    return false;
  }
  const normalizedValue = normalized(value);
  if (locale.startsWith("zh-")) {
    return /[\u4e00-\u9fff]/.test(value);
  }
  if (locale === "ja-jp") {
    return /[\u3040-\u30ff]/.test(value);
  }
  if (locale === "ko-kr") {
    return /[\uac00-\ud7af]/.test(value);
  }
  const markers = localeLanguageMarkers[locale] ?? [];
  if (markers.length === 0) {
    return true;
  }
  const hits = markers.filter((marker) =>
    normalizedValue.includes(marker),
  ).length;
  return hits >= Math.min(3, markers.length);
}

const localeLanguageMarkers: Partial<Record<Article["locale"], string[]>> = {
  "en-us": ["the", "and", "for", "with", "buyer"],
  "en-gb": ["the", "and", "for", "with", "buyer"],
  "de-de": [
    "der",
    "die",
    "das",
    "und",
    "fuer",
    "nicht",
    "kaufen",
    "preis",
    "rueckgabe",
  ],
  "fr-fr": ["le", "la", "les", "et", "pour", "prix", "retour", "acheter"],
  "it-it": ["il", "la", "per", "con", "prezzo", "reso", "acquistare"],
  "es-es": ["el", "la", "para", "con", "precio", "devolucion", "comprar"],
  "pt-br": ["o", "a", "para", "com", "preco", "devolucao", "comprar"],
  "nl-nl": ["de", "het", "voor", "met", "prijs", "retour", "kopen"],
  "pl-pl": ["dla", "oraz", "cena", "zwrot", "kupic", "przed"],
  "sv-se": ["och", "foer", "med", "pris", "retur", "koepa"],
  "tr-tr": ["ve", "icin", "fiyat", "iade", "satın", "almadan"],
  "th-th": ["ราคา", "ซื้อ", "คืน", "สินค้า"],
  "vi-vn": ["gia", "mua", "tra", "hang", "san pham"],
};

function looksMostlyEnglish(value: string) {
  const words = normalized(value).split(/\s+/).filter(Boolean);
  if (words.length < 80) {
    return false;
  }
  const englishMarkers = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "you",
    "your",
    "before",
    "buy",
    "check",
    "price",
    "seller",
    "return",
    "product",
  ]);
  const markerCount = words.filter((word) =>
    englishMarkers.has(word.replace(/[^a-z]/g, "")),
  ).length;
  return markerCount / words.length > 0.08;
}

function textSimilarity(first: string, second: string) {
  const firstTokens = tokenSet(first);
  const secondTokens = tokenSet(second);
  if (firstTokens.size === 0 || secondTokens.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const token of firstTokens) {
    if (secondTokens.has(token)) {
      intersection += 1;
    }
  }
  const union = new Set([...firstTokens, ...secondTokens]).size;
  return intersection / union;
}

function tokenSet(value: string) {
  return new Set(
    normalized(value)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3),
  );
}
