import type { Article } from "@global-import-lab/types";

export const complianceIssuePrefixes = [
  "health_",
  "unsafe_",
  "localization_",
  "translation_",
  "affiliate_placements_over_limit",
  "affiliate_links_exceed_internal_links",
  "affiliate_placement",
  "merchant_allowlist"
];

export function isComplianceRelevantIssue(code: string, prefixes = complianceIssuePrefixes) {
  return prefixes.some((prefix) => code.startsWith(prefix));
}

export function shouldSkipSampleComplianceRow(article: Article, relevantIssueCodes: string[]) {
  return (
    article.healthSensitivity === "none" &&
    article.complianceStatus === "passed" &&
    relevantIssueCodes.length === 0
  );
}
