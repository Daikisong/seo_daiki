import type { Article } from "@global-import-lab/types";
import { runQualityGate } from "./qualityGate";

export function healthFixtureFailures(articles: Article[]) {
  const failures: string[] = [];
  const ingredientGuide = articles.find((item) => item.type === "ingredient_guide" && item.locale === "en");
  if (!ingredientGuide) {
    failures.push("English ingredient_guide fixture is missing.");
    return failures;
  }

  const unapprovedHighHealth = runQualityGate({
    article: {
      ...ingredientGuide,
      complianceStatus: "manual_required",
      healthSensitivity: "high",
      indexStatus: "index"
    }
  });
  if (!unapprovedHighHealth.issues.some((issue) => issue.code === "health_high_sensitivity_manual_approval_required")) {
    failures.push("High-sensitivity health fixture should require manual approval before index.");
  }

  const unsupportedMedicalClaim = runQualityGate({
    article: {
      ...ingredientGuide,
      id: "fixture-health-bad-claim",
      title: "Magnesium supplement cure claim fixture",
      evidenceIds: [],
      contentMdx: `${ingredientGuide.contentMdx} This supplement cures insomnia and is guaranteed.`,
      complianceStatus: "unchecked"
    }
  });
  if (!unsupportedMedicalClaim.issues.some((issue) => issue.code.startsWith("health_claim_"))) {
    failures.push("Unsupported health-claim fixture should be blocked by HealthClaimGuard.");
  }

  return failures;
}
