import type { Article } from "@global-import-lab/types";
import type { ValidationIssue } from "./types";

export function validateHealthClaimGuard(article: Article): ValidationIssue[] {
  const fullText = [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.affiliateLinks.flatMap((link) => [link.label, link.href])
  ]
    .join(" ")
    .toLowerCase();
  const healthSensitivity = article.healthSensitivity ?? "none";
  const looksHealthRelated =
    healthSensitivity !== "none" ||
    /\b(iherb|supplement|magnesium|probiotic|vitamin|dosage|dose|gut health|sleep|pregnancy|medication|chronic|ingredient|wellness|nutrition)\b/i.test(
      fullText
    );

  if (!looksHealthRelated) {
    return [];
  }

  const issues: ValidationIssue[] = [];
  const disclaimerPresent =
    /\bnot medical advice\b/i.test(fullText) &&
    /\bconsult (a|your) (qualified )?(doctor|physician|healthcare professional|professional)\b/i.test(fullText);
  const hasQualifiedHealthEvidence =
    article.complianceStatus === "passed" &&
    article.evidenceIds.length > 0 &&
    /\b(source|evidence|label direction|manufacturer label|manual approval)\b/i.test(fullText);
  const forbiddenClaims: Array<{ pattern: RegExp; code: string; message: string }> = [
    {
      pattern: /\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing)\b/i,
      code: "health_claim_disease_language",
      message: "Health content cannot use cure, treatment, or prevention language without qualified evidence and manual approval."
    },
    {
      pattern: /\bguaranteed\b/i,
      code: "health_claim_guarantee",
      message: "Health content cannot use guaranteed outcome language."
    },
    {
      pattern: /\bdoctor recommended\b/i,
      code: "health_claim_doctor_recommended",
      message: "Doctor-recommended claims need qualified source evidence and manual approval."
    },
    {
      pattern: /\bclinically proven\b/i,
      code: "health_claim_clinically_proven",
      message: "Clinically-proven claims need qualified clinical source evidence."
    },
    {
      pattern: /\breplace (your )?(medicine|medication|treatment|doctor)\b/i,
      code: "health_claim_medical_replacement",
      message: "Health content cannot recommend replacing medical treatment or a professional consultation."
    },
    {
      pattern: /\b(before and after|transformation|transform your body|rapid results)\b/i,
      code: "health_claim_transformation",
      message: "Unsupported before/after or transformation claims are blocked for health content."
    },
    {
      pattern: /\b(you should take|you need to take|safe for everyone|stop taking medication)\b/i,
      code: "health_claim_medical_advice",
      message: "Medical advice language is blocked for supplement content."
    }
  ];

  for (const claim of forbiddenClaims) {
    if (claim.pattern.test(fullText) && !hasQualifiedHealthEvidence) {
      issues.push({
        code: claim.code,
        message: claim.message,
        severity: "blocker"
      });
    }
  }

  if (/\b(dosage|dose|take \d+|\d+\s?(mg|mcg|g|iu)\b|mg per day|capsules per day)\b/i.test(fullText) && !hasQualifiedHealthEvidence) {
    issues.push({
      code: "health_dosage_without_source",
      message: "Supplement dosage advice needs qualified source evidence or label-direction context.",
      severity: "blocker"
    });
  }

  const hasSupplementOffer = article.affiliateLinks.some((link) => /iherb|supplement|vitamin|magnesium|probiotic/i.test(`${link.label} ${link.href}`));
  if (!disclaimerPresent && (hasSupplementOffer || healthSensitivity !== "none")) {
    issues.push({
      code: "health_disclaimer_missing",
      message: "Health or iHerb supplement pages need a visible informational-only disclaimer and professional-consultation warning.",
      severity: "blocker"
    });
  }

  if (/\b(pregnancy|pregnant|medication|children|child|chronic illness|chronic condition)\b/i.test(fullText) && !/\bconsult\b/i.test(fullText)) {
    issues.push({
      code: "health_sensitive_warning_missing",
      message: "Health content mentioning pregnancy, medication, children, or chronic illness needs a consult-professional warning.",
      severity: "blocker"
    });
  }

  if (healthSensitivity === "high" && article.indexStatus === "index" && article.complianceStatus !== "passed") {
    issues.push({
      code: "health_high_sensitivity_manual_approval_required",
      message: "High-sensitivity health articles require manual compliance approval before indexing.",
      severity: "blocker"
    });
  }

  if (/^best\b.+\b(supplement|vitamin|magnesium|probiotic)/i.test(article.title)) {
    issues.push({
      code: "health_generic_best_supplement_title",
      message: "Generic best-supplement titles need stronger sourcing and specificity.",
      severity: "warning"
    });
  }

  return issues;
}
