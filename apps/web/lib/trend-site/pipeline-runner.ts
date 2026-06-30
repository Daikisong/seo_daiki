import { isIndexableLocale } from "./locales";
import {
  fixtureProductCandidates,
  fixtureTrendCandidate,
} from "./pipeline-fixture";
import type {
  ArticleDraft,
  ArticleStrategy,
  BuyerProblemMap,
  CommercialFitReport,
  EvidenceLedgerItem,
  KeywordExpansion,
  PipelineArtifacts,
  ProductCandidate,
  ProductCandidateToProductResult,
  PublishCandidate,
  RepairTask,
  SERPObservation,
  SERPPatternAnalysis,
  TrendCandidate,
} from "./pipeline-models";
import {
  buildQualityGateReport,
  repairTasksFromQualityGateReport,
} from "./quality-gate-report";
import { runArticleQualityGate } from "./quality-gate";
import type { Article, Product } from "./types";

type PipelineDryRunInput = {
  trendCandidate?: TrendCandidate;
  productCandidates?: ProductCandidate[];
  generatedAt?: string;
  relatedDrafts?: ArticleDraft[];
};

export function runTrendToAffiliatePipelineDryRun(
  input: PipelineDryRunInput = {},
): PipelineArtifacts {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const trendCandidate = input.trendCandidate ?? fixtureTrendCandidate;
  const productCandidates = input.productCandidates ?? fixtureProductCandidates;
  const runId = `dry-run-${safeTimestamp(generatedAt)}`;

  const keywordExpansion = buildKeywordExpansion(trendCandidate);
  const serpObservations = buildSerpObservations(
    trendCandidate,
    keywordExpansion,
    generatedAt,
  );
  const serpPatternAnalysis = buildSerpPatternAnalysis(
    trendCandidate,
    serpObservations,
  );
  const buyerProblemMap = buildBuyerProblemMap(trendCandidate);
  const commercialFitReport = buildCommercialFitReport(trendCandidate);
  const articleStrategy = buildArticleStrategy(trendCandidate, buyerProblemMap);
  const articleDraft = buildArticleDraft(articleStrategy, trendCandidate);

  const convertedProducts = productCandidates.map((candidate) =>
    productCandidateToProduct(candidate, trendCandidate.locale, generatedAt),
  );
  const products = convertedProducts.map((result) => result.product);
  const evidenceLedger = [
    ...trendEvidenceLedger(trendCandidate),
    ...convertedProducts.flatMap((result) => result.evidenceLedgerItems),
  ];

  const qualityGateInput = articleDraftToQualityArticle(
    articleDraft,
    trendCandidate,
    articleStrategy,
  );
  const qualityGate = runArticleQualityGate(qualityGateInput, products, {
    allArticles: [qualityGateInput],
    siteOrigin: "https://trend-jacob.example",
    mode: "dry-run",
  });
  const qualityGateReport = buildQualityGateReport(qualityGate);
  const repairTasks = [
    ...productCandidates.flatMap((candidate) =>
      productCandidateRepairTasks(candidate),
    ),
    ...localeDuplicateRepairTasks([
      articleDraft,
      ...(input.relatedDrafts ?? []),
    ]),
    ...repairTasksFromQualityGateReport(qualityGateReport),
  ];
  const publishCandidate = buildPublishCandidate(
    articleDraft,
    qualityGateReport.contentGatePass,
    repairTasks,
    [articleDraft, ...(input.relatedDrafts ?? [])],
  );

  return {
    run_id: runId,
    generated_at: generatedAt,
    mode: "dry-run",
    trend_candidate: trendCandidate,
    keyword_expansion: keywordExpansion,
    serp_observations: serpObservations,
    serp_pattern_analysis: serpPatternAnalysis,
    buyer_problem_map: buyerProblemMap,
    commercial_fit_report: commercialFitReport,
    product_candidates: productCandidates,
    evidence_ledger: evidenceLedger,
    article_strategy: articleStrategy,
    article_draft: articleDraft,
    quality_gate_report: qualityGateReport,
    repair_tasks: dedupeRepairTasks(repairTasks),
    publish_candidate: publishCandidate,
  };
}

function buildKeywordExpansion(candidate: TrendCandidate): KeywordExpansion {
  return {
    trendCandidateId: candidate.id,
    primaryKeyword: candidate.seedKeyword,
    localKeywords: [
      "Europe heatwave portable AC",
      "portable air conditioner Europe",
      "mobile air conditioner heatwave",
      "real compressor AC vs air cooler",
    ],
    buyerKeywords: [
      "portable AC return policy",
      "portable AC window kit",
      "portable AC voltage plug Europe",
      "portable AC BTU room size",
    ],
    avoidKeywords: [
      "USB mini air cooler",
      "fan sold as air conditioner",
      "wrong voltage portable AC",
    ],
  };
}

function buildSerpObservations(
  candidate: TrendCandidate,
  keywords: KeywordExpansion,
  observedAt: string,
): SERPObservation[] {
  return keywords.localKeywords.slice(0, 3).map((keyword, index) => ({
    id: `serp-${index + 1}`,
    keyword,
    locale: candidate.locale,
    observedAt,
    url: `https://example-serp-source.test/${index + 1}`,
    title: `${keyword} brief example`,
    sourceType: index === 0 ? "publisher" : index === 1 ? "blog" : "retailer",
    notes:
      "Fixture observation used to shape buyer questions, comparison sections, and risk warnings.",
  }));
}

function buildSerpPatternAnalysis(
  candidate: TrendCandidate,
  observations: SERPObservation[],
): SERPPatternAnalysis {
  return {
    trendCandidateId: candidate.id,
    dominantFormats: observations.map((observation) => observation.sourceType),
    commonSections: [
      "quick answer",
      "product shortlist",
      "comparison table",
      "FAQ",
      "buying risks",
    ],
    gapsToExploit: [
      "separate compressor ACs from mini coolers",
      "show return and voltage risk",
      "add country buying routes",
    ],
    readerQuestions: [
      "Is this a real air conditioner?",
      "Can I return it locally?",
      "Will the window kit fit?",
    ],
  };
}

function buildBuyerProblemMap(candidate: TrendCandidate): BuyerProblemMap {
  return {
    trendCandidateId: candidate.id,
    issueSummary:
      "Heatwave searches can push readers toward fast cooling purchases.",
    buyerProblem:
      "The reader needs to separate real compressor ACs from fans, mini coolers, and risky imports.",
    productCategory: "portable air conditioner heatwave cooling",
    mustCompare: [
      "compressor AC class",
      "BTU and room size",
      "window kit",
      "noise",
      "voltage",
      "return path",
    ],
    avoidConfusions: [
      "USB mini cooler",
      "fan-only tower",
      "smart AC controller sold as cooling hardware",
    ],
    localFitRequirements: [
      "local voltage",
      "plug type",
      "delivery date",
      "warranty territory",
      "bulky-return route",
    ],
  };
}

function buildCommercialFitReport(
  candidate: TrendCandidate,
): CommercialFitReport {
  return {
    trendCandidateId: candidate.id,
    status: "eligible",
    monetizableMarketplaces: ["Amazon", "AliExpress", "Temu", "Local retailer"],
    affiliateFitNotes: [
      "Heavy compressor ACs should prefer local retailer routes.",
      "AliExpress and Temu are better fits for accessories unless local stock and returns are clear.",
    ],
    riskNotes: [
      "Do not turn a general heatwave news item into product links unless the buyer problem is concrete.",
    ],
  };
}

function buildArticleStrategy(
  candidate: TrendCandidate,
  buyerProblem: BuyerProblemMap,
): ArticleStrategy {
  return {
    trendCandidateId: candidate.id,
    targetLocale: candidate.locale,
    title:
      "Europe heatwave portable AC guide 2026: real cooling picks and risky mini coolers",
    slug: "europe-heatwave-portable-ac-dry-run",
    productCategory: buyerProblem.productCategory,
    categorySlug: categorySlugForProductCategory(buyerProblem.productCategory),
    angle: "Issue-to-product bridge for heatwave cooling decisions.",
    introBridge:
      "Explain the heatwave issue briefly, then move into the practical decision: real compressor ACs, local fit, return route, and products to avoid.",
    requiredSections: [
      "Intro",
      "Quick answer",
      "Top 10 practical picks",
      "Comparison table",
      "Review-signal warnings before product notes",
      "Supporting clarification after final thoughts",
      "Before-you-buy checklist",
      "FAQ",
    ],
    marketplaceRule:
      "Local retailers for heavy compressor ACs; marketplaces for accessories only when terms are clear.",
  };
}

function categorySlugForProductCategory(productCategory: string) {
  const normalizedCategory = productCategory.toLowerCase();
  if (
    normalizedCategory.includes("air conditioner") ||
    normalizedCategory.includes("cooling") ||
    normalizedCategory.includes("fan") ||
    normalizedCategory.includes("home")
  ) {
    return "home-trends";
  }
  if (
    normalizedCategory.includes("charger") ||
    normalizedCategory.includes("electronics") ||
    normalizedCategory.includes("usb")
  ) {
    return "electronics-trends";
  }
  return undefined;
}

function buildArticleDraft(
  strategy: ArticleStrategy,
  candidate: TrendCandidate,
): ArticleDraft {
  return {
    id: `draft-${candidate.id}`,
    strategyId: strategy.trendCandidateId,
    locale: strategy.targetLocale,
    slug: strategy.slug,
    title: strategy.title,
    h1: strategy.title,
    summary:
      "Heatwave searches are rising, but the buying problem is choosing a real room-cooling product instead of a weak mini cooler or wrong-voltage import.",
    productCategory: strategy.productCategory,
    categorySlug: strategy.categorySlug,
    indexStatus: "noindex",
    publishStatus: "draft",
    contentBlocks: [
      {
        role: "intro",
        heading: "What is moving now",
        body: "Heatwave demand can make cooling products sell quickly and make weak listings look more attractive than they are.",
      },
      {
        role: "quick-answer",
        heading: "Quick answer",
        body: "For this issue, compare real compressor ACs by room size, hose setup, voltage, delivery timing, and return route.",
      },
      {
        role: "top-picks",
        heading: "Top 10 practical picks",
        body: "Use the product shortlist only after checking exact variants and local availability.",
      },
    ],
    affiliateLinks: [],
  };
}

function productCandidateToProduct(
  candidate: ProductCandidate,
  locale: TrendCandidate["locale"],
  checkedAt: string,
): ProductCandidateToProductResult {
  const evidenceLedgerItems: EvidenceLedgerItem[] = [];
  const officialSpecSource = candidate.officialSpecSource;
  const marketplaceSource = candidate.marketplaceSource;
  const reviewComplaintSignal = candidate.reviewComplaintSignal;
  const priceState = candidate.priceState ?? candidatePriceState(candidate);

  if (officialSpecSource) {
    evidenceLedgerItems.push({
      id: `${candidate.id}-official-spec`,
      productCandidateId: candidate.id,
      evidenceType: "official-spec",
      sourceLabel: officialSpecSource.label,
      url: officialSpecSource.url,
      checkedAt,
      summary:
        "Official or retailer product details used for exact variant and spec checks.",
    });
  }
  if (marketplaceSource) {
    evidenceLedgerItems.push({
      id: `${candidate.id}-marketplace`,
      productCandidateId: candidate.id,
      evidenceType: "marketplace",
      sourceLabel: marketplaceSource.label,
      url: marketplaceSource.url,
      checkedAt: candidate.priceCheckedAt ?? checkedAt,
      summary:
        "Marketplace or merchant route used for price and seller-route checks.",
    });
  }
  if (reviewComplaintSignal) {
    evidenceLedgerItems.push({
      id: `${candidate.id}-review-complaint`,
      productCandidateId: candidate.id,
      evidenceType: "review-complaint",
      sourceLabel: reviewComplaintSignal.label,
      url: reviewComplaintSignal.url,
      checkedAt,
      summary: reviewComplaintSignal.summary,
    });
  }
  if (candidate.localRiskNote) {
    evidenceLedgerItems.push({
      id: `${candidate.id}-local-risk`,
      productCandidateId: candidate.id,
      evidenceType: "local-risk",
      sourceLabel: "Local fit note",
      checkedAt,
      summary: candidate.localRiskNote,
    });
  }

  const product: Product = {
    id: candidate.id,
    canonicalName: candidate.name,
    exactVariant: candidate.exactVariant,
    category: candidate.category,
    productRole: candidate.productRole,
    merchantUrl: candidate.merchantUrl,
    merchantUrlKind: candidate.merchantUrlKind ?? "merchant-product-page",
    sourceUrl: officialSpecSource?.url ?? "",
    sourceLabel: officialSpecSource?.label ?? "",
    reviewSourceUrl: reviewComplaintSignal?.url ?? "",
    reviewSourceLabel: reviewComplaintSignal?.label ?? "",
    marketplaceSourceLabel: marketplaceSource?.label ?? "",
    priceCheckedAt: candidate.priceCheckedAt ?? "",
    imageUrl: "https://merchant.example/images/pipeline-placeholder.jpg",
    imageAlt: candidate.exactVariant,
    priceLabel: candidate.priceLabel,
    priceState,
    productKind: "Real compressor portable AC",
    regionFit: candidate.localRiskNote ?? "",
    coolingCapacity: "9000 BTU class",
    hoseType: "Window exhaust hose required",
    noiseLevel: "Check recent buyer notes for night noise.",
    roomSize: "Small to medium room.",
    voltagePlug: "Check local voltage and plug before buying.",
    returnRiskLabel: candidate.returnRiskLabel ?? "",
    evidenceLevel: candidate.evidenceLevel ?? "insufficient",
    evidenceBasis: productEvidenceBasis(candidate),
    specSummary: officialSpecSource
      ? "Spec route lists product class, exact variant, voltage, hose setup, and kit details."
      : "",
    reviewSummary: reviewComplaintSignal?.summary ?? "",
    safetyNote: candidate.localRiskNote ?? "",
    bestFor: candidate.bestFor,
    whyRecommend:
      "It answers the heatwave buyer problem when the exact variant, local fit, and return route are visible.",
    whoFits: candidate.bestFor,
    whoShouldSkip: candidate.skipIf,
    repeatedComplaints: reviewComplaintSignal
      ? [
          "Hose or window-kit fit.",
          "Noise in bedrooms.",
          reviewComplaintSignal.summary,
        ]
      : [],
    warrantyReturnNote: candidate.localRiskNote ?? "",
    marketplaceNote:
      "Use this route only when the seller page confirms the exact model, shipped price, and return terms.",
    keyCheck: candidate.keyCheck,
    keyFeatures: [
      "Real compressor class",
      "Window exhaust setup",
      "Local return route check",
    ],
    editorialRankLabel: "Practical cooling pick",
    expertReviewTake:
      "This pick belongs in the dry-run shortlist only if the live listing confirms the same model, local fit, and return path.",
    editorialPros: [
      "Clear buyer use case.",
      "Exact variant can be checked.",
      "Return route is part of the decision.",
    ],
    editorialCons: [
      "Needs local fit verification.",
      "Heavy returns can be expensive.",
      "Stock and delivery can move quickly.",
    ],
    verifiedClaims: officialSpecSource
      ? [
          {
            id: `${candidate.id}-claim`,
            productId: candidate.id,
            testType: "spec",
            resultValue: "9000",
            unit: "BTU class",
          },
        ]
      : [],
    priceSnapshots:
      candidate.priceCheckedAt && marketplaceSource
        ? [
            {
              id: `${candidate.id}-price`,
              productId: candidate.id,
              country: candidate.priceCountry ?? "GB",
              currency: candidate.priceCurrency ?? "GBP",
              price: candidate.price ?? null,
              finalPrice: candidate.price ?? null,
              priceLabel: candidate.priceLabel,
              priceState,
            },
          ]
        : [],
    reviewSignals: reviewComplaintSignal
      ? [
          {
            id: `${candidate.id}-review`,
            productId: candidate.id,
            locale,
            topic: "hose fit, noise, drainage, delivery, and bulky returns",
            count: reviewComplaintSignal.count,
          },
        ]
      : [],
    marketRisks: candidate.localRiskNote
      ? [
          {
            id: `${candidate.id}-risk`,
            productId: candidate.id,
            locale,
            country: "Europe",
            certificationRisk: "check-local-voltage-and-plug",
            returnRisk: candidate.returnRiskLabel ?? "check-bulky-return-route",
          },
        ]
      : [],
  };

  return {
    product,
    evidenceLedgerItems,
    repairTasks: productCandidateRepairTasks(candidate),
  };
}

function candidatePriceState(candidate: ProductCandidate) {
  if (candidate.merchantUrlKind === "marketplace-search-route") {
    return "search-route";
  }
  if (candidate.price === null || candidate.price === undefined) {
    return "unavailable";
  }
  return candidate.priceLabel.includes("-") ? "range" : "checked";
}

function productEvidenceBasis(candidate: ProductCandidate) {
  const parts = [
    candidate.officialSpecSource ? "product details" : "",
    candidate.marketplaceSource ? "price route" : "",
    candidate.reviewComplaintSignal ? "buyer complaints" : "",
    candidate.localRiskNote ? "local fit risk" : "",
  ].filter(Boolean);
  return parts.length > 0
    ? `Checked ${parts.join(", ")} before adding this candidate.`
    : "";
}

export function productCandidateRepairTasks(
  candidate: ProductCandidate,
): RepairTask[] {
  const tasks: RepairTask[] = [];
  if (!candidate.localRiskNote?.trim()) {
    tasks.push({
      id: `${candidate.id}-missing-local-fit`,
      source: "pipeline",
      code: "MISSING_LOCAL_FIT",
      severity: "repair",
      target: candidate.id,
      title: "Product candidate is missing local fit guidance.",
      action:
        "Add voltage, plug, delivery, return, warranty, and country-specific risk notes before publishing.",
    });
  }
  if (
    !candidate.evidenceLevel ||
    !candidate.officialSpecSource ||
    !candidate.marketplaceSource ||
    !candidate.priceCheckedAt ||
    !candidate.priceState ||
    !candidate.reviewComplaintSignal
  ) {
    tasks.push({
      id: `${candidate.id}-missing-evidence`,
      source: "pipeline",
      code: "MISSING_PRODUCT_EVIDENCE",
      severity: "repair",
      target: candidate.id,
      title: "Product candidate is missing required evidence.",
      action:
        "Attach evidence level, official/spec source, marketplace source, price checked date, and review or complaint signal.",
    });
  }
  if (
    candidate.price === 0 ||
    (candidate.priceState === "checked" &&
      (!candidate.price || candidate.price <= 0))
  ) {
    tasks.push({
      id: `${candidate.id}-invalid-price`,
      source: "pipeline",
      code: "INVALID_PRICE_SNAPSHOT",
      severity: "repair",
      target: candidate.id,
      title: "Product candidate price snapshot is not publishable.",
      action:
        "Use a positive numeric price for checked prices, or use null with priceState unavailable, range, or search-route.",
    });
  }
  return tasks;
}

function articleDraftToQualityArticle(
  draft: ArticleDraft,
  candidate: TrendCandidate,
  strategy: ArticleStrategy,
): Article {
  return {
    id: draft.id,
    authorId: "jacob",
    productEvidenceById: "trendbrief-editors",
    editedById: "trendbrief-editors",
    locale: draft.locale,
    slug: draft.slug,
    type: "trend",
    title: draft.title,
    h1: draft.h1,
    metaDescription: draft.summary,
    summary: draft.summary,
    affiliateDisclosure:
      "Price buttons may be paid affiliate links when approved later.",
    imageUrl: "https://merchant.example/images/pipeline-article.jpg",
    categorySlug: draft.categorySlug,
    productCategory: draft.productCategory,
    contentMdx: draft.contentBlocks
      .map((block) => `${block.heading}\n${block.body}`)
      .join("\n\n"),
    trendSignalBox: {
      heading: "Why this matters now",
      body: candidate.evidence[0]?.note ?? strategy.introBridge,
      items: [
        { label: "Buyer problem", body: strategy.introBridge },
        { label: "Product category", body: draft.productCategory },
      ],
    },
    marketplaceRule: {
      heading: "Marketplace rule",
      body: strategy.marketplaceRule,
      bullets: [
        "Check the exact model.",
        "Check the final shipped price.",
        "Check the return route.",
      ],
    },
    countryBuyingRoutes: [
      {
        market: "United Kingdom",
        route:
          "Check local retailer stock, plug type, delivery date, and return pickup.",
      },
      {
        market: "Germany / France",
        route:
          "Use local appliance retailers when voltage and warranty territory matter.",
      },
    ],
    avoidListHeading: "Cooling products I would not treat as portable AC",
    avoidList: [
      {
        label: "USB mini coolers",
        reason: "They do not exhaust heat outside.",
      },
      {
        label: "Smart AC controllers",
        reason:
          "They control existing AC units but do not cool a room by themselves.",
      },
    ],
    targetRegion: "Europe",
    requiresCountryBuyingRoutes: true,
    requiresAvoidList: true,
    sections: draft.contentBlocks.map((block) => ({
      role: articleSectionRoleForDraftBlock(block.role),
      heading: block.heading,
      body: block.body,
    })),
    faqs: [
      {
        question: "Should I buy a heavy AC from a cross-border marketplace?",
        answer: "Only when voltage, stock, and returns are clear.",
      },
      {
        question: "Is a mini cooler the same as portable AC?",
        answer: "No. A real AC exhausts heat outside.",
      },
      {
        question: "What should I check first?",
        answer:
          "Check product class, room size, window kit, voltage, and return path.",
      },
    ],
    expertCopy: {
      topPicksHeading: "Top 10 practical picks",
      topPicksIntro:
        "Start with products that show local fit, exact model details, and return terms.",
      topPicksRule:
        "Treat a changed model number, seller, voltage, or bundle as a different product.",
      quickListIntro:
        "Start with the shortlist, then use the product notes below to check variant fit, price route, repeated complaints, and return risk.",
      comparisonHeading: "Quick comparison table",
      comparisonIntro:
        "Use the table to narrow by room fit, product class, and return risk.",
      comparisonFootnote:
        "Draft prices are placeholders until merchant feeds are approved.",
      inDepthHeading: "My in-depth notes on all 10 picks",
      topThreeHeading: "My Personal Top 3 Recommendations",
      finalThoughtsHeading: "Final thoughts",
      finalThoughts: [
        "Publish only after live links, local fit, and product evidence are checked.",
      ],
      buyingChecklistHeading: "Before you buy",
      buyingChecklist: [
        "Check exact variant.",
        "Check local return route.",
        "Check buyer complaints.",
      ],
      updateLogHeading: "Update log",
      updateLog: [
        `${candidate.detectedAt.slice(0, 10)}: Dry-run artifact generated.`,
      ],
    },
    evidenceIds: candidate.evidence.map(
      (_, index) => `${candidate.id}-trend-${index + 1}`,
    ),
    affiliateLinks: draft.affiliateLinks,
    localization: draft.localization
      ? {
          clusterId: draft.localization.clusterId,
          xDefault: draft.localization.xDefault,
        }
      : undefined,
    lastUpdated: candidate.detectedAt.slice(0, 10),
    indexStatus: draft.indexStatus,
    publishStatus: "published",
  };
}

function articleSectionRoleForDraftBlock(
  role: ArticleDraft["contentBlocks"][number]["role"],
) {
  if (
    role === "quick-answer" ||
    role === "category-clarification" ||
    role === "alternative-comparison" ||
    role === "review-warning"
  ) {
    return role;
  }
  return undefined;
}

function buildPublishCandidate(
  draft: ArticleDraft,
  qualityPass: boolean,
  repairTasks: RepairTask[],
  allDrafts: ArticleDraft[],
): PublishCandidate {
  const manualReviewReady = qualityPass && repairTasks.length === 0;
  return {
    articleDraftId: draft.id,
    canPublish: false,
    manualReviewReady,
    manualOnly: true,
    sitemapAction: "none",
    publicRouteAction: "none",
    hreflangAlternates: manualReviewReady
      ? buildDraftHreflangAlternates(draft, allDrafts)
      : {},
    reason: manualReviewReady
      ? "Ready for manual review only; dry-run never writes public routes or sitemap entries."
      : "Repair or evidence tasks remain; dry-run artifact only.",
  };
}

export function buildDraftHreflangAlternates(
  draft: ArticleDraft,
  allDrafts: ArticleDraft[],
) {
  const draftLocalization = draft.localization;
  if (!draftLocalization || draft.indexStatus !== "index") {
    return {};
  }
  const variants = allDrafts.filter(
    (candidate) =>
      candidate.id !== draft.id &&
      candidate.localization?.clusterId === draftLocalization.clusterId &&
      candidate.localization.coreTrendId === draftLocalization.coreTrendId &&
      candidate.localization.buyerProblemId ===
        draftLocalization.buyerProblemId &&
      candidate.indexStatus === "index" &&
      isIndexableLocale(candidate.locale),
  );
  if (variants.length === 0 || !isIndexableLocale(draft.locale)) {
    return {};
  }
  return Object.fromEntries(
    [draft, ...variants].map((variant) => [
      variant.locale,
      `/${variant.locale}/trends/${variant.slug}/`,
    ]),
  );
}

export function localeDuplicateRepairTasks(
  drafts: ArticleDraft[],
): RepairTask[] {
  const tasks: RepairTask[] = [];
  for (let firstIndex = 0; firstIndex < drafts.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < drafts.length;
      secondIndex += 1
    ) {
      const first = drafts[firstIndex];
      const second = drafts[secondIndex];
      if (
        first.locale === second.locale ||
        isTrueLocalizedAlternative(first, second)
      ) {
        continue;
      }
      if (
        textSimilarity(articleDraftText(first), articleDraftText(second)) > 0.82
      ) {
        tasks.push({
          id: `${first.id}-${second.id}-near-duplicate-locale`,
          source: "pipeline",
          code: "NEAR_DUPLICATE_LOCALE_REPAIR",
          severity: "repair",
          target: `${first.id}:${second.id}`,
          title:
            "Two locale drafts are too similar without being true localized alternatives.",
          action:
            "Rewrite the local buyer problem, retailers, risks, product routes, and review sources before publishing.",
        });
      }
    }
  }
  return tasks;
}

function isTrueLocalizedAlternative(first: ArticleDraft, second: ArticleDraft) {
  return Boolean(
    first.localization &&
    second.localization &&
    first.localization.clusterId === second.localization.clusterId &&
    first.localization.coreTrendId === second.localization.coreTrendId &&
    first.localization.buyerProblemId === second.localization.buyerProblemId,
  );
}

function trendEvidenceLedger(candidate: TrendCandidate): EvidenceLedgerItem[] {
  return candidate.evidence.map((item, index) => ({
    id: `${candidate.id}-trend-${index + 1}`,
    trendCandidateId: candidate.id,
    evidenceType: "trend",
    sourceLabel: item.sourceLabel,
    url: item.url,
    checkedAt: item.observedAt,
    summary: item.note,
  }));
}

function dedupeRepairTasks(tasks: RepairTask[]) {
  const seen = new Set<string>();
  return tasks.filter((task) => {
    const key = `${task.code}:${task.target}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function articleDraftText(draft: ArticleDraft) {
  return [
    draft.title,
    draft.h1,
    draft.summary,
    ...draft.contentBlocks.flatMap((block) => [block.heading, block.body]),
  ].join(" ");
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
    value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3),
  );
}

function safeTimestamp(value: string) {
  return value
    .replace(/[^0-9a-z]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
