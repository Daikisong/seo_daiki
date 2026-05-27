import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "./qualityGate";

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
