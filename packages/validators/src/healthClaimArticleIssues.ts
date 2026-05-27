import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function healthDisclaimerIssue(
  article: Article,
  disclaimerPresent: boolean,
  hasSupplementOffer: boolean
): ValidationIssue | undefined {
  if (disclaimerPresent || (!hasSupplementOffer && (article.healthSensitivity ?? "none") === "none")) {
    return undefined;
  }
  return {
    code: "health_disclaimer_missing",
    message: "Health or iHerb supplement pages need a visible informational-only disclaimer and professional-consultation warning.",
    severity: "blocker"
  };
}

export function highSensitivityApprovalIssue(article: Article): ValidationIssue | undefined {
  if (article.healthSensitivity !== "high" || article.indexStatus !== "index" || article.complianceStatus === "passed") {
    return undefined;
  }
  return {
    code: "health_high_sensitivity_manual_approval_required",
    message: "High-sensitivity health articles require manual compliance approval before indexing.",
    severity: "blocker"
  };
}

export function genericBestSupplementTitleIssue(article: Article): ValidationIssue | undefined {
  if (!/^best\b.+\b(supplement|vitamin|magnesium|probiotic)/i.test(article.title)) {
    return undefined;
  }
  return {
    code: "health_generic_best_supplement_title",
    message: "Generic best-supplement titles need stronger sourcing and specificity.",
    severity: "warning"
  };
}
