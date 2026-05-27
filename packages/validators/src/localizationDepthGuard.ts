import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import { booleanJsonField, numericJsonField, stringJsonField } from "./validationUtils";

export function validateLocalizationDepthGuard(article: Article): ValidationIssue[] {
  const score = article.localizationDepthScore ?? numericJsonField(article.complianceJson, "localizationDepthScore");
  const translationStatus = article.translationStatus ?? stringJsonField(article.complianceJson, "translationStatus");
  const translationOnly = booleanJsonField(article.complianceJson, "translationOnly");

  if (article.indexStatus !== "index") {
    return [];
  }

  if (translationOnly) {
    return [
      {
        code: "translation_only_page_noindex_required",
        message: "Translation-only localized pages must remain noindex until local depth is added.",
        severity: "blocker"
      }
    ];
  }

  if ((translationStatus === "localized" || score !== undefined) && (score ?? 0) < 80) {
    return [
      {
        code: "localization_depth_below_index_threshold",
        message: `Localized pages need localizationDepthScore >= 80 before indexing; found ${score ?? 0}.`,
        severity: "blocker"
      }
    ];
  }

  return [];
}
