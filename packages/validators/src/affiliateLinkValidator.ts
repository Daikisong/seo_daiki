import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import { articleText, hostForUrl, hostMatchesDomain, sharedCommerceTerm } from "./validationUtils";

const placementLimits: Partial<Record<Article["type"], number>> = {
  trend: 2,
  buyer_guide: 4,
  deal_watch: 6,
  ingredient_guide: 3,
  review: 4
};

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
    const relTokens = new Set(link.rel.split(/\s+/).filter(Boolean));
    if (!relTokens.has("sponsored") || !relTokens.has("nofollow")) {
      issues.push({
        code: "affiliate_rel_invalid",
        message: `Affiliate link "${link.label}" must render rel="sponsored nofollow".`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

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
