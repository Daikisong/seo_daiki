import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

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
    if (!hasSponsoredNofollow(link.rel)) {
      issues.push({
        code: "affiliate_rel_invalid",
        message: `Affiliate link "${link.label}" must render rel="sponsored nofollow".`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function hasSponsoredNofollow(rel: string): boolean {
  const relTokens = new Set(rel.split(/\s+/).filter(Boolean));
  return relTokens.has("sponsored") && relTokens.has("nofollow");
}
