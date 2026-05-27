import { articles, evidencePacks, indexedArticles, plannedUrlTotal, products } from "@global-import-lab/content";
import { sampleQualityFailures } from "./validateSampleQuality";
import { sampleRouteFailures } from "./validateSampleRoutes";

const indexableCount = indexedArticles().length;
const failures = [
  ...sampleRouteFailures({ articles, indexableCount, plannedUrlTotal }),
  ...sampleQualityFailures({ articles, evidencePacks, products })
];

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Validated ${articles.length} sample articles; ${indexableCount} indexable articles passed the quality gate.`
);
