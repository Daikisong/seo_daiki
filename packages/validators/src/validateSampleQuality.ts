import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "./qualityGate";

export function sampleQualityFailures({
  articles,
  evidencePacks,
  products
}: {
  articles: Article[];
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  return [
    ...healthFixtureFailures(articles),
    ...qualityGateIndexFailures(articles, products, evidencePacks)
  ];
}

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

export function qualityGateIndexFailures(
  articles: Article[],
  products: Product[],
  evidencePacks: EvidencePack[]
) {
  const failures: string[] = [];
  for (const article of articles) {
    const product = article.productId ? products.find((item) => item.id === article.productId) : undefined;
    const evidencePack = evidencePacks.find(
      (pack) => pack.productId === article.productId && pack.locale === article.locale
    );
    const result = runQualityGate({ article, product, evidencePack });

    if (article.indexStatus === "index" && result.indexStatus !== "index") {
      failures.push(
        `${article.locale}/${article.type}/${article.slug}: expected index but gate returned ${result.indexStatus} (${result.score})`
      );
      for (const issue of result.issues) {
        failures.push(`  - ${issue.code}: ${issue.message}`);
      }
    }
  }
  return failures;
}
