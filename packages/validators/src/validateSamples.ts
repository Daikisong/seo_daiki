import { articles, evidencePacks, indexedArticles, plannedUrlTotal, products } from "@global-import-lab/content";
import { articlePath } from "@global-import-lab/seo";
import { runQualityGate } from "./index";

const failures: string[] = [];
const indexableCount = indexedArticles().length;

if (plannedUrlTotal !== 110) {
  failures.push(`Initial URL plan should generate 110 URLs, but generated ${plannedUrlTotal}.`);
}

if (indexableCount < 40 || indexableCount > 60) {
  failures.push(`Initial index selection should stay between 40 and 60 pages, but found ${indexableCount}.`);
}

for (const article of articles.filter((item) => item.type === "review")) {
  const path = articlePath(article);
  if (article.locale === "es" && !path.includes("/es/resenas/")) {
    failures.push(`Spanish review should use /es/resenas/: ${path}`);
  }
  if (article.locale === "pt-br" && !path.includes("/pt-br/analises/")) {
    failures.push(`Brazilian review should use /pt-br/analises/: ${path}`);
  }
  if (article.locale === "en" && !path.includes("/en/reviews/")) {
    failures.push(`English review should use /en/reviews/: ${path}`);
  }
}

for (const article of articles.filter((item) => item.type === "guide")) {
  const path = articlePath(article);
  if (article.locale === "es" && !path.includes("/es/guias/")) {
    failures.push(`Spanish guide should use /es/guias/: ${path}`);
  }
  if (article.locale === "pt-br" && !path.includes("/pt-br/guias/")) {
    failures.push(`Brazilian guide should use /pt-br/guias/: ${path}`);
  }
}

const requiredRiskPaths = new Map([
  ["aliexpress-chargers-us-buyers", "/en-us/guides/aliexpress-chargers-us-buyers/"],
  ["aliexpress-chargers-uk-buyers", "/en-gb/guides/aliexpress-chargers-uk-buyers/"],
  ["cargadores-aliexpress-espana", "/es-es/guias/cargadores-aliexpress-espana/"],
  ["carregadores-aliexpress-brasil", "/pt-br/guias/carregadores-aliexpress-brasil/"]
]);

for (const [slug, expectedPath] of requiredRiskPaths) {
  const article = articles.find((item) => item.type === "risk" && item.slug === slug);
  const path = article ? articlePath(article) : undefined;
  if (path !== expectedPath) {
    failures.push(`Country-risk page should use ${expectedPath}, but found ${path ?? "missing"}.`);
  }
}

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

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${articles.length} sample articles; ${indexableCount} indexable articles passed the quality gate.`
);
