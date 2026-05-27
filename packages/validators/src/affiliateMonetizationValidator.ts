import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export const placementLimits: Partial<Record<Article["type"], number>> = {
  trend: 2,
  buyer_guide: 4,
  deal_watch: 6,
  ingredient_guide: 3,
  review: 4
};

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
