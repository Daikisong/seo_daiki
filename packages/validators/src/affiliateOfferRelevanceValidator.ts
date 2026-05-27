import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import { articleText, sharedCommerceTerm } from "./validationUtils";

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
