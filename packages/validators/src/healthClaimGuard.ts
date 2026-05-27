import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";
import {
  dosageAdviceIssue,
  forbiddenHealthClaimIssues,
  genericBestSupplementTitleIssue,
  healthDisclaimerIssue,
  healthSensitiveWarningIssue,
  highSensitivityApprovalIssue
} from "./healthClaimRules";
import {
  articleHealthClaimText,
  articleLooksHealthRelated,
  hasQualifiedHealthEvidence,
  hasSupplementOffer,
  healthDisclaimerPresent
} from "./healthClaimText";

export function validateHealthClaimGuard(article: Article): ValidationIssue[] {
  const fullText = articleHealthClaimText(article);
  if (!articleLooksHealthRelated(article, fullText)) {
    return [];
  }

  const issues: ValidationIssue[] = [];
  const qualifiedEvidence = hasQualifiedHealthEvidence(article, fullText);
  issues.push(...forbiddenHealthClaimIssues(fullText, qualifiedEvidence));
  pushIssue(issues, dosageAdviceIssue(fullText, qualifiedEvidence));
  pushIssue(issues, healthDisclaimerIssue(article, healthDisclaimerPresent(fullText), hasSupplementOffer(article)));
  pushIssue(issues, healthSensitiveWarningIssue(fullText));
  pushIssue(issues, highSensitivityApprovalIssue(article));
  pushIssue(issues, genericBestSupplementTitleIssue(article));

  return issues;
}

function pushIssue(issues: ValidationIssue[], issue: ValidationIssue | undefined) {
  if (issue) {
    issues.push(issue);
  }
}
