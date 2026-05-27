import type { IndexStatus } from "@global-import-lab/types";
import {
  validateAffiliateLinks,
  validateAffiliatePlacementGuard,
  validateMerchantAllowlistGuard,
  validateOfferRelevanceGuard,
  validateOverMonetizationGuard,
  validateUnsafeRedirectGuard
} from "./affiliateLinkValidator";
import { validateClaimEvidence } from "./claimEvidence";
import { validateHealthClaimGuard } from "./healthClaimGuard";
import { validateHreflang } from "./hreflangValidator";
import { validateInternalLinks } from "./internalLinks";
import { validateLocalizationDepthGuard } from "./localizationDepthGuard";
import { validatePublishStateGuard } from "./publishStateGuard";
import { validateSeoIntegrity } from "./seoIntegrity";
import { validateStructuredData } from "./structuredDataValidation";
import { validateThinAffiliate } from "./thinAffiliate";
import { validateTrendEvidenceGuard } from "./trendEvidenceGuard";
import type { QualityGateInput, QualityGateResult } from "./types";

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
