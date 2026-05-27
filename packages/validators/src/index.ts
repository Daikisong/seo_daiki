import type { Article, IndexStatus } from "@global-import-lab/types";
import { articlePath, canonicalForArticle, hreflangKeyForArticle } from "@global-import-lab/seo";
import {
  articleText,
  booleanJsonField,
  hostForUrl,
  hostMatchesDomain,
  normalizeUrl,
  numericJsonField,
  sharedCommerceTerm,
  stringJsonField
} from "./validationUtils";
import { validateStructuredData } from "./structuredDataValidation";
import type { QualityGateInput, QualityGateResult, ValidationIssue } from "./types";
export { validateStructuredData } from "./structuredDataValidation";
export type { QualityGateInput, QualityGateResult, ValidationIssue } from "./types";

const placementLimits: Partial<Record<Article["type"], number>> = {
  trend: 2,
  buyer_guide: 4,
  deal_watch: 6,
  ingredient_guide: 3,
  review: 4
};

export function validateAffiliateLinks(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (article.type === "review" && article.affiliateLinks.length === 0) {
    issues.push({
      code: "affiliate_missing",
      message: "Review pages must include an affiliate disclosure and at least one tracked affiliate link.",
      severity: "blocker"
    });
  }

  for (const link of article.affiliateLinks) {
    const relTokens = new Set(link.rel.split(/\s+/).filter(Boolean));
    if (!relTokens.has("sponsored") || !relTokens.has("nofollow")) {
      issues.push({
        code: "affiliate_rel_invalid",
        message: `Affiliate link "${link.label}" must render rel="sponsored nofollow".`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function validatePublishStateGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (article.indexStatus === "index" && article.publishStatus !== "published") {
    issues.push({
      code: "publish_state_not_published",
      message: "Indexable articles must be published.",
      severity: "blocker"
    });
  }

  if (article.indexStatus === "index" && article.qualityScore < 80) {
    issues.push({
      code: "quality_score_below_index_threshold",
      message: `Indexable articles need qualityScore >= 80; found ${article.qualityScore}.`,
      severity: "blocker"
    });
  }

  return issues;
}

export function validateUnsafeRedirectGuard(article: Article): ValidationIssue[] {
  return article.affiliateLinks.flatMap((link) => {
    if (/\/api\/affiliate-click\/?\?[^#]*\btarget=/i.test(link.href)) {
      return [
        {
          code: "unsafe_affiliate_target_redirect",
          message: `Affiliate link "${link.label}" uses arbitrary target redirect mode.`,
          severity: "blocker" as const
        }
      ];
    }
    return [];
  });
}

export function validateAffiliatePlacementGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const link of article.affiliateLinks) {
    if (link.placementId && link.placementStatus && link.placementStatus !== "approved") {
      issues.push({
        code: "affiliate_placement_not_approved",
        message: `Affiliate placement ${link.placementId} must be approved before an indexable page renders it.`,
        severity: "blocker"
      });
    }

    if (link.placementId && link.disclosureShown === false) {
      issues.push({
        code: "affiliate_placement_disclosure_missing",
        message: `Affiliate placement ${link.placementId} must confirm disclosure visibility.`,
        severity: "blocker"
      });
    }

    if (link.placementId && link.offerStatus && link.offerStatus !== "active") {
      issues.push({
        code: "affiliate_offer_not_active",
        message: `Affiliate placement ${link.placementId} points to an offer that is not active.`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function validateMerchantAllowlistGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const link of article.affiliateLinks) {
    if (!link.merchantAllowedDomains?.length) {
      continue;
    }

    const host = hostForUrl(link.href);
    if (!host) {
      issues.push({
        code: "affiliate_url_invalid",
        message: `Affiliate link "${link.label}" must be a valid URL.`,
        severity: "blocker"
      });
      continue;
    }

    if (!link.merchantAllowedDomains.some((domain) => hostMatchesDomain(host, domain))) {
      issues.push({
        code: "merchant_allowlist_mismatch",
        message: `Affiliate link "${link.label}" host ${host} is not allowed for merchant ${link.merchantSlug ?? "unknown"}.`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function validateLocalizationDepthGuard(article: Article): ValidationIssue[] {
  const score = article.localizationDepthScore ?? numericJsonField(article.complianceJson, "localizationDepthScore");
  const translationStatus = article.translationStatus ?? stringJsonField(article.complianceJson, "translationStatus");
  const translationOnly = booleanJsonField(article.complianceJson, "translationOnly");

  if (article.indexStatus !== "index") {
    return [];
  }

  if (translationOnly) {
    return [
      {
        code: "translation_only_page_noindex_required",
        message: "Translation-only localized pages must remain noindex until local depth is added.",
        severity: "blocker"
      }
    ];
  }

  if ((translationStatus === "localized" || score !== undefined) && (score ?? 0) < 80) {
    return [
      {
        code: "localization_depth_below_index_threshold",
        message: `Localized pages need localizationDepthScore >= 80 before indexing; found ${score ?? 0}.`,
        severity: "blocker"
      }
    ];
  }

  return [];
}

export function validateTrendEvidenceGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const text = articleText(article);

  if (article.type === "trend") {
    if (article.evidenceIds.length < 3 || !/\b(trend|signal|source|rising|why|freshness)\b/i.test(text)) {
      issues.push({
        code: "trend_evidence_missing",
        message: "Trend articles need trend/source signals, why-now explanation, and at least 3 evidence references.",
        severity: "blocker"
      });
    }
    if (article.internalLinks.length < 3) {
      issues.push({
        code: "trend_internal_links_low",
        message: "Trend articles need at least 3 relevant internal links.",
        severity: "blocker"
      });
    }
  }

  if (article.type === "deal_watch") {
    if (!/\b(price history|last checked|buy|wait|avoid|zone)\b/i.test(text)) {
      issues.push({
        code: "deal_watch_logic_missing",
        message: "Deal watch pages need price history, last checked context, and buy/wait/avoid logic.",
        severity: "blocker"
      });
    }
    if (/\b(hurry|limited time|act now|only today|before it is gone)\b/i.test(text)) {
      issues.push({
        code: "deal_watch_fake_urgency",
        message: "Deal watch pages cannot use fake urgency language.",
        severity: "blocker"
      });
    }
  }

  if (article.type === "ingredient_guide") {
    const supportedClaimsPattern = /\b(supported|apoyad[ao]s?|respaldad[ao]s?|apoiad[ao]s?|suportad[ao]s?)\b/i;
    const unsupportedClaimsPattern =
      /\b(unsupported|no apoyad[ao]s?|no respaldad[ao]s?|não apoiad[ao]s?|nao apoiad[ao]s?|não suportad[ao]s?|nao suportad[ao]s?)\b/i;
    if (!supportedClaimsPattern.test(text) || !unsupportedClaimsPattern.test(text)) {
      issues.push({
        code: "ingredient_claim_separation_missing",
        message: "Ingredient guides must separate supported and unsupported claims.",
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function validateOfferRelevanceGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const text = articleText(article);

  for (const link of article.affiliateLinks) {
    const linkText = `${link.label} ${link.href} ${link.merchantSlug ?? ""}`.toLowerCase();
    if (/\bcommission|highest payout|epc\b/i.test(linkText)) {
      issues.push({
        code: "offer_commission_first_language",
        message: "Offer placement cannot be justified by commission language.",
        severity: "blocker"
      });
    }

    if (article.type === "ingredient_guide" && !/\b(iherb|supplement|vitamin|magnesium|probiotic|ingredient)\b/i.test(linkText)) {
      issues.push({
        code: "ingredient_offer_not_relevant",
        message: "Ingredient guide offers must be health/supplement relevant and guarded.",
        severity: "blocker"
      });
    }

    if (["trend", "buyer_guide", "deal_watch"].includes(article.type) && !sharedCommerceTerm(text, linkText)) {
      issues.push({
        code: "offer_relevance_weak",
        message: `Affiliate link "${link.label}" does not share enough topical terms with the article.`,
        severity: "warning"
      });
    }
  }

  return issues;
}

export function validateOverMonetizationGuard(article: Article): ValidationIssue[] {
  const limit = placementLimits[article.type];
  if (limit !== undefined && article.affiliateLinks.length > limit) {
    return [
      {
        code: "affiliate_placements_over_limit",
        message: `${article.type} pages allow at most ${limit} affiliate placements; found ${article.affiliateLinks.length}.`,
        severity: "blocker"
      }
    ];
  }

  if (article.affiliateLinks.length > article.internalLinks.length) {
    return [
      {
        code: "affiliate_links_exceed_internal_links",
        message: "Affiliate links should not outnumber internal evidence/navigation links.",
        severity: "warning"
      }
    ];
  }

  return [];
}

export function validateInternalLinks(article: Article): ValidationIssue[] {
  if (article.internalLinks.length >= 5) {
    return [];
  }

  return [
    {
      code: "internal_links_low",
      message: `Article has ${article.internalLinks.length} internal links; indexable pages need at least 5.`,
      severity: "blocker"
    }
  ];
}

export function validateHreflang(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ownHref = article.hreflangMap[hreflangKeyForArticle(article)] ?? article.hreflangMap[article.locale];
  if (!ownHref) {
    issues.push({
      code: "hreflang_self_missing",
      message: "Localized pages must include a self hreflang alternate.",
      severity: "blocker"
    });
  }

  if (!article.hreflangMap["x-default"]) {
    issues.push({
      code: "hreflang_default_missing",
      message: "Localized pages must include an x-default alternate.",
      severity: "warning"
    });
  }

  return issues;
}

export function validateSeoIntegrity(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const expectedCanonical = canonicalForArticle(article);
  const expectedPath = articlePath(article);
  const ownHref = article.hreflangMap[hreflangKeyForArticle(article)] ?? article.hreflangMap[article.locale];

  if (article.canonicalUrl && normalizeUrl(article.canonicalUrl) !== normalizeUrl(expectedCanonical)) {
    issues.push({
      code: "canonical_mismatch",
      message: `Stored canonical ${article.canonicalUrl} should match generated canonical ${expectedCanonical}.`,
      severity: "blocker"
    });
  }

  if (ownHref && normalizeUrl(ownHref) !== normalizeUrl(expectedCanonical)) {
    issues.push({
      code: "hreflang_self_mismatch",
      message: `Self hreflang ${ownHref} should match the page canonical ${expectedCanonical}.`,
      severity: "blocker"
    });
  }

  if (!expectedPath.endsWith(`/${article.slug}/`)) {
    issues.push({
      code: "slug_path_mismatch",
      message: `Article slug ${article.slug} is not the final path segment in ${expectedPath}.`,
      severity: "blocker"
    });
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    issues.push({
      code: "slug_format_invalid",
      message: `Slug should be lowercase ASCII words separated by hyphens: ${article.slug}.`,
      severity: "blocker"
    });
  }

  if (article.title.length < 35 || article.title.length > 80) {
    issues.push({
      code: "title_length_outside_seo_range",
      message: `Title length should stay between 35 and 80 characters; found ${article.title.length}.`,
      severity: "warning"
    });
  }

  if (article.metaDescription.length < 90 || article.metaDescription.length > 170) {
    issues.push({
      code: "meta_description_length_outside_seo_range",
      message: `Meta description length should stay between 90 and 170 characters; found ${article.metaDescription.length}.`,
      severity: "warning"
    });
  }

  if (/^best\b.+\b20\d{2}\b/i.test(article.title)) {
    issues.push({
      code: "generic_best_year_title",
      message: "Title should not use generic 'Best ... 20xx' phrasing without evidence-first specificity.",
      severity: "blocker"
    });
  }

  for (const [hreflang, href] of Object.entries(article.hreflangMap)) {
    if (!href) {
      continue;
    }
    if (!/^https?:\/\//i.test(href)) {
      issues.push({
        code: "hreflang_not_absolute",
        message: `Hreflang ${hreflang} must use an absolute URL: ${href}.`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function validateClaimEvidence(input: QualityGateInput): ValidationIssue[] {
  const { article, evidencePack, product } = input;
  const evidenceIds = new Set(article.evidenceIds);
  const backedSections = article.sections.filter((section) => section.evidenceIds?.some((id) => evidenceIds.has(id)));
  const verifiedClaimCount = product?.verifiedClaims.length ?? evidencePack?.packJson.verifiedClaims.length ?? 0;
  const sellerClaimCount = product?.sellerClaims.length ?? evidencePack?.packJson.sellerClaims.length ?? 0;
  const attachedEvidenceCount = verifiedClaimCount + sellerClaimCount || article.evidenceIds.length;
  const issues: ValidationIssue[] = [];

  if (backedSections.length < 3 || attachedEvidenceCount < 3) {
    issues.push({
      code: "evidence_claims_low",
      message: "Indexable articles need at least 3 evidence-backed claims.",
      severity: "blocker"
    });
  }

  const fullText = [article.title, article.summary, ...article.sections.map((section) => section.body)].join(" ");
  const unsupportedTestPhrase = /\b(we tested|our test|lab measured|verified by test)\b/i.test(fullText);
  if (unsupportedTestPhrase && verifiedClaimCount === 0) {
    issues.push({
      code: "test_claim_without_verified_evidence",
      message: "The article uses direct-test language but no verified claims are attached.",
      severity: "blocker"
    });
  }

  return issues;
}

export function validateThinAffiliate(input: QualityGateInput): ValidationIssue[] {
  const { article, product } = input;
  const uniqueSignals =
    article.sections.filter((section) =>
      /variant|risk|evidence|price|verified|tested|customs|plug|return|alternative/i.test(
        `${section.heading} ${section.body}`
      )
    ).length + (product?.marketRisks.length ?? 0);

  if (uniqueSignals < 4) {
    return [
      {
        code: "thin_affiliate_risk",
        message: "The article does not yet show enough information beyond seller descriptions.",
        severity: "blocker"
      }
    ];
  }

  return [];
}

export function validateHealthClaimGuard(article: Article): ValidationIssue[] {
  const fullText = [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.affiliateLinks.flatMap((link) => [link.label, link.href])
  ]
    .join(" ")
    .toLowerCase();
  const healthSensitivity = article.healthSensitivity ?? "none";
  const looksHealthRelated =
    healthSensitivity !== "none" ||
    /\b(iherb|supplement|magnesium|probiotic|vitamin|dosage|dose|gut health|sleep|pregnancy|medication|chronic|ingredient|wellness|nutrition)\b/i.test(
      fullText
    );

  if (!looksHealthRelated) {
    return [];
  }

  const issues: ValidationIssue[] = [];
  const disclaimerPresent =
    /\bnot medical advice\b/i.test(fullText) &&
    /\bconsult (a|your) (qualified )?(doctor|physician|healthcare professional|professional)\b/i.test(fullText);
  const hasQualifiedHealthEvidence =
    article.complianceStatus === "passed" &&
    article.evidenceIds.length > 0 &&
    /\b(source|evidence|label direction|manufacturer label|manual approval)\b/i.test(fullText);
  const forbiddenClaims: Array<{ pattern: RegExp; code: string; message: string }> = [
    {
      pattern: /\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing)\b/i,
      code: "health_claim_disease_language",
      message: "Health content cannot use cure, treatment, or prevention language without qualified evidence and manual approval."
    },
    {
      pattern: /\bguaranteed\b/i,
      code: "health_claim_guarantee",
      message: "Health content cannot use guaranteed outcome language."
    },
    {
      pattern: /\bdoctor recommended\b/i,
      code: "health_claim_doctor_recommended",
      message: "Doctor-recommended claims need qualified source evidence and manual approval."
    },
    {
      pattern: /\bclinically proven\b/i,
      code: "health_claim_clinically_proven",
      message: "Clinically-proven claims need qualified clinical source evidence."
    },
    {
      pattern: /\breplace (your )?(medicine|medication|treatment|doctor)\b/i,
      code: "health_claim_medical_replacement",
      message: "Health content cannot recommend replacing medical treatment or a professional consultation."
    },
    {
      pattern: /\b(before and after|transformation|transform your body|rapid results)\b/i,
      code: "health_claim_transformation",
      message: "Unsupported before/after or transformation claims are blocked for health content."
    },
    {
      pattern: /\b(you should take|you need to take|safe for everyone|stop taking medication)\b/i,
      code: "health_claim_medical_advice",
      message: "Medical advice language is blocked for supplement content."
    }
  ];

  for (const claim of forbiddenClaims) {
    if (claim.pattern.test(fullText) && !hasQualifiedHealthEvidence) {
      issues.push({
        code: claim.code,
        message: claim.message,
        severity: "blocker"
      });
    }
  }

  if (/\b(dosage|dose|take \d+|\d+\s?(mg|mcg|g|iu)\b|mg per day|capsules per day)\b/i.test(fullText) && !hasQualifiedHealthEvidence) {
    issues.push({
      code: "health_dosage_without_source",
      message: "Supplement dosage advice needs qualified source evidence or label-direction context.",
      severity: "blocker"
    });
  }

  const hasSupplementOffer = article.affiliateLinks.some((link) => /iherb|supplement|vitamin|magnesium|probiotic/i.test(`${link.label} ${link.href}`));
  if (!disclaimerPresent && (hasSupplementOffer || healthSensitivity !== "none")) {
    issues.push({
      code: "health_disclaimer_missing",
      message: "Health or iHerb supplement pages need a visible informational-only disclaimer and professional-consultation warning.",
      severity: "blocker"
    });
  }

  if (/\b(pregnancy|pregnant|medication|children|child|chronic illness|chronic condition)\b/i.test(fullText) && !/\bconsult\b/i.test(fullText)) {
    issues.push({
      code: "health_sensitive_warning_missing",
      message: "Health content mentioning pregnancy, medication, children, or chronic illness needs a consult-professional warning.",
      severity: "blocker"
    });
  }

  if (healthSensitivity === "high" && article.indexStatus === "index" && article.complianceStatus !== "passed") {
    issues.push({
      code: "health_high_sensitivity_manual_approval_required",
      message: "High-sensitivity health articles require manual compliance approval before indexing.",
      severity: "blocker"
    });
  }

  if (/^best\b.+\b(supplement|vitamin|magnesium|probiotic)/i.test(article.title)) {
    issues.push({
      code: "health_generic_best_supplement_title",
      message: "Generic best-supplement titles need stronger sourcing and specificity.",
      severity: "warning"
    });
  }

  return issues;
}

export function runQualityGate(input: QualityGateInput): QualityGateResult {
  const { article, product, evidencePack } = input;
  const publishStateIssues = validatePublishStateGuard(article);
  const claimEvidenceIssues = validateClaimEvidence(input);
  const thinAffiliateIssues = validateThinAffiliate(input);
  const internalLinkIssues = validateInternalLinks(article);
  const hreflangIssues = validateHreflang(article);
  const seoIntegrityIssues = validateSeoIntegrity(article);
  const structuredDataIssues = validateStructuredData(input);
  const affiliateIssues = validateAffiliateLinks(article);
  const unsafeRedirectIssues = validateUnsafeRedirectGuard(article);
  const affiliatePlacementIssues = validateAffiliatePlacementGuard(article);
  const merchantAllowlistIssues = validateMerchantAllowlistGuard(article);
  const localizationDepthIssues = validateLocalizationDepthGuard(article);
  const trendEvidenceIssues = validateTrendEvidenceGuard(article);
  const offerRelevanceIssues = validateOfferRelevanceGuard(article);
  const overMonetizationIssues = validateOverMonetizationGuard(article);
  const healthIssues = validateHealthClaimGuard(article);
  const issues = [
    ...publishStateIssues,
    ...claimEvidenceIssues,
    ...thinAffiliateIssues,
    ...internalLinkIssues,
    ...hreflangIssues,
    ...seoIntegrityIssues,
    ...structuredDataIssues,
    ...affiliateIssues,
    ...unsafeRedirectIssues,
    ...affiliatePlacementIssues,
    ...merchantAllowlistIssues,
    ...localizationDepthIssues,
    ...trendEvidenceIssues,
    ...offerRelevanceIssues,
    ...overMonetizationIssues,
    ...healthIssues
  ];

  const hasEvidencePack = Boolean(evidencePack) || article.evidenceIds.length >= 3;
  const hasLocaleRisk =
    product?.marketRisks.some((risk) => risk.locale === article.locale) ??
    /country|customs|risk|local|brasil|españa|spain|brazil/i.test(article.contentMdx);

  const breakdown = {
    searchIntent: article.summary.length > 80 ? 10 : 5,
    uniqueInfo: thinAffiliateIssues.length === 0 ? 20 : 8,
    evidencePack: hasEvidencePack ? 15 : 0,
    verifiedData:
      (product?.verifiedClaims.length ?? evidencePack?.packJson.verifiedClaims.length ?? article.evidenceIds.length) > 0
        ? 20
        : 8,
    variantTraps: /variant|option|plug|cable/i.test(article.contentMdx) ? 10 : 3,
    localeRisk: hasLocaleRisk ? 10 : 4,
    internalLinks: article.internalLinks.length >= 5 ? 5 : 0,
    seoIntegrity:
      hreflangIssues.length === 0 && seoIntegrityIssues.length === 0 && structuredDataIssues.length === 0 ? 5 : 2,
    affiliateIntegrity:
      affiliateIssues.length === 0 &&
      unsafeRedirectIssues.length === 0 &&
      affiliatePlacementIssues.length === 0 &&
      merchantAllowlistIssues.length === 0 &&
      offerRelevanceIssues.filter((issue) => issue.severity === "blocker").length === 0 &&
      overMonetizationIssues.filter((issue) => issue.severity === "blocker").length === 0 &&
      healthIssues.length === 0
        ? 3
        : 0,
    publishingSafety:
      publishStateIssues.length === 0 &&
      localizationDepthIssues.length === 0 &&
      trendEvidenceIssues.length === 0
        ? 2
        : 0
  };

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const hasBlocker = issues.some((issue) => issue.severity === "blocker");
  const indexStatus: IndexStatus = hasBlocker ? "noindex" : score >= 80 ? "index" : score >= 65 ? "pending" : "noindex";

  return { score, indexStatus, issues, breakdown };
}
