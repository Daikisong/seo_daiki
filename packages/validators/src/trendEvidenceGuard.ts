import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import { articleText } from "./validationUtils";

export function validateTrendEvidenceGuard(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const text = articleText(article);

  if (article.type === "trend") {
    if (article.evidenceIds.length < 3 || !/\b(trend|signal|source|rising|why|freshness)\b/i.test(text)) {
      issues.push({
        code: "trend_evidence_missing",
        message: "Trend articles need trend/source signals, why-now explanation, and at least 3 evidence references.",
        severity: "blocker"
      });
    }
    if (article.internalLinks.length < 3) {
      issues.push({
        code: "trend_internal_links_low",
        message: "Trend articles need at least 3 relevant internal links.",
        severity: "blocker"
      });
    }
  }

  if (article.type === "deal_watch") {
    if (!/\b(price history|last checked|buy|wait|avoid|zone)\b/i.test(text)) {
      issues.push({
        code: "deal_watch_logic_missing",
        message: "Deal watch pages need price history, last checked context, and buy/wait/avoid logic.",
        severity: "blocker"
      });
    }
    if (/\b(hurry|limited time|act now|only today|before it is gone)\b/i.test(text)) {
      issues.push({
        code: "deal_watch_fake_urgency",
        message: "Deal watch pages cannot use fake urgency language.",
        severity: "blocker"
      });
    }
  }

  if (article.type === "ingredient_guide") {
    const supportedClaimsPattern = /\b(supported|apoyad[ao]s?|respaldad[ao]s?|apoiad[ao]s?|suportad[ao]s?)\b/i;
    const unsupportedClaimsPattern =
      /\b(unsupported|no apoyad[ao]s?|no respaldad[ao]s?|não apoiad[ao]s?|nao apoiad[ao]s?|não suportad[ao]s?|nao suportad[ao]s?)\b/i;
    if (!supportedClaimsPattern.test(text) || !unsupportedClaimsPattern.test(text)) {
      issues.push({
        code: "ingredient_claim_separation_missing",
        message: "Ingredient guides must separate supported and unsupported claims.",
        severity: "blocker"
      });
    }
  }

  return issues;
}
