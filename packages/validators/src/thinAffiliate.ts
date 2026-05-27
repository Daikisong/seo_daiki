import type { QualityGateInput, ValidationIssue } from "./types";

export function validateThinAffiliate(input: QualityGateInput): ValidationIssue[] {
  const { article, product } = input;
  const uniqueSignals =
    article.sections.filter((section) =>
      /variant|risk|evidence|price|verified|tested|customs|plug|return|alternative/i.test(
        `${section.heading} ${section.body}`
      )
    ).length + (product?.marketRisks.length ?? 0);

  if (uniqueSignals < 4) {
    return [
      {
        code: "thin_affiliate_risk",
        message: "The article does not yet show enough information beyond seller descriptions.",
        severity: "blocker"
      }
    ];
  }

  return [];
}
