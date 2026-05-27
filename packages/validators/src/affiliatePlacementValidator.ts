import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

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
