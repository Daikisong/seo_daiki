import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import { hostForUrl, hostMatchesDomain } from "./validationUtils";

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
