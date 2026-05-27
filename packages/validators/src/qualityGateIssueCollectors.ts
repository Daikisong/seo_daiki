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
import type { QualityGateInput, ValidationIssue } from "./types";

export interface QualityGateIssueGroups {
  publishStateIssues: ValidationIssue[];
  claimEvidenceIssues: ValidationIssue[];
  thinAffiliateIssues: ValidationIssue[];
  internalLinkIssues: ValidationIssue[];
  hreflangIssues: ValidationIssue[];
  seoIntegrityIssues: ValidationIssue[];
  structuredDataIssues: ValidationIssue[];
  affiliateIssues: ValidationIssue[];
  unsafeRedirectIssues: ValidationIssue[];
  affiliatePlacementIssues: ValidationIssue[];
  merchantAllowlistIssues: ValidationIssue[];
  localizationDepthIssues: ValidationIssue[];
  trendEvidenceIssues: ValidationIssue[];
  offerRelevanceIssues: ValidationIssue[];
  overMonetizationIssues: ValidationIssue[];
  healthIssues: ValidationIssue[];
}

export function collectQualityGateIssues(input: QualityGateInput): QualityGateIssueGroups {
  const { article } = input;
  return {
    publishStateIssues: validatePublishStateGuard(article),
    claimEvidenceIssues: validateClaimEvidence(input),
    thinAffiliateIssues: validateThinAffiliate(input),
    internalLinkIssues: validateInternalLinks(article),
    hreflangIssues: validateHreflang(article),
    seoIntegrityIssues: validateSeoIntegrity(article),
    structuredDataIssues: validateStructuredData(input),
    affiliateIssues: validateAffiliateLinks(article),
    unsafeRedirectIssues: validateUnsafeRedirectGuard(article),
    affiliatePlacementIssues: validateAffiliatePlacementGuard(article),
    merchantAllowlistIssues: validateMerchantAllowlistGuard(article),
    localizationDepthIssues: validateLocalizationDepthGuard(article),
    trendEvidenceIssues: validateTrendEvidenceGuard(article),
    offerRelevanceIssues: validateOfferRelevanceGuard(article),
    overMonetizationIssues: validateOverMonetizationGuard(article),
    healthIssues: validateHealthClaimGuard(article)
  };
}

export function flattenQualityGateIssues(groups: QualityGateIssueGroups) {
  return Object.values(groups).flat();
}
