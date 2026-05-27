import type { QualityGateInput } from "./types";
import type { QualityGateIssueGroups } from "./qualityGateIssueCollectors";

export function qualityGateScoreBreakdown(
  input: QualityGateInput,
  issueGroups: QualityGateIssueGroups
) {
  const { article, product, evidencePack } = input;
  const hasEvidencePack = Boolean(evidencePack) || article.evidenceIds.length >= 3;
  const hasLocaleRisk =
    product?.marketRisks.some((risk) => risk.locale === article.locale) ??
    /country|customs|risk|local|brasil|españa|spain|brazil/i.test(article.contentMdx);

  return {
    searchIntent: article.summary.length > 80 ? 10 : 5,
    uniqueInfo: issueGroups.thinAffiliateIssues.length === 0 ? 20 : 8,
    evidencePack: hasEvidencePack ? 15 : 0,
    verifiedData:
      (product?.verifiedClaims.length ?? evidencePack?.packJson.verifiedClaims.length ?? article.evidenceIds.length) > 0
        ? 20
        : 8,
    variantTraps: /variant|option|plug|cable/i.test(article.contentMdx) ? 10 : 3,
    localeRisk: hasLocaleRisk ? 10 : 4,
    internalLinks: article.internalLinks.length >= 5 ? 5 : 0,
    seoIntegrity:
      issueGroups.hreflangIssues.length === 0 &&
      issueGroups.seoIntegrityIssues.length === 0 &&
      issueGroups.structuredDataIssues.length === 0
        ? 5
        : 2,
    affiliateIntegrity:
      issueGroups.affiliateIssues.length === 0 &&
      issueGroups.unsafeRedirectIssues.length === 0 &&
      issueGroups.affiliatePlacementIssues.length === 0 &&
      issueGroups.merchantAllowlistIssues.length === 0 &&
      issueGroups.offerRelevanceIssues.filter((issue) => issue.severity === "blocker").length === 0 &&
      issueGroups.overMonetizationIssues.filter((issue) => issue.severity === "blocker").length === 0 &&
      issueGroups.healthIssues.length === 0
        ? 3
        : 0,
    publishingSafety:
      issueGroups.publishStateIssues.length === 0 &&
      issueGroups.localizationDepthIssues.length === 0 &&
      issueGroups.trendEvidenceIssues.length === 0
        ? 2
        : 0
  };
}

export function sumQualityGateScore(breakdown: Record<string, number>) {
  return Object.values(breakdown).reduce((sum, value) => sum + value, 0);
}
