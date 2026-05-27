import type { Article, IndexStatus } from "@global-import-lab/types";
import {
  articleText,
  booleanJsonField,
  numericJsonField,
  stringJsonField
} from "./validationUtils";
import { validateStructuredData } from "./structuredDataValidation";
import {
  validateAffiliateLinks,
  validateAffiliatePlacementGuard,
  validateMerchantAllowlistGuard,
  validateOfferRelevanceGuard,
  validateOverMonetizationGuard,
  validateUnsafeRedirectGuard
} from "./affiliateLinkValidator";
import { validateHealthClaimGuard } from "./healthClaimGuard";
import { validateHreflang } from "./hreflangValidator";
import { validateInternalLinks } from "./internalLinks";
import { validateSeoIntegrity } from "./seoIntegrity";
import { validateClaimEvidence } from "./claimEvidence";
import { validateThinAffiliate } from "./thinAffiliate";
import type { QualityGateInput, QualityGateResult, ValidationIssue } from "./types";
export { validateStructuredData } from "./structuredDataValidation";
export {
  validateAffiliateLinks,
  validateAffiliatePlacementGuard,
  validateMerchantAllowlistGuard,
  validateOfferRelevanceGuard,
  validateOverMonetizationGuard,
  validateUnsafeRedirectGuard
} from "./affiliateLinkValidator";
export { validateHealthClaimGuard } from "./healthClaimGuard";
export { validateHreflang } from "./hreflangValidator";
export { validateInternalLinks } from "./internalLinks";
export { validateSeoIntegrity } from "./seoIntegrity";
export { validateClaimEvidence } from "./claimEvidence";
export { validateThinAffiliate } from "./thinAffiliate";
export type { QualityGateInput, QualityGateResult, ValidationIssue } from "./types";

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
