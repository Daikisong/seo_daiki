import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { healthFixtureFailures } from "./sampleHealthFixtureFailures";
import { qualityGateIndexFailures } from "./sampleQualityGateFailures";

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

export { healthFixtureFailures } from "./sampleHealthFixtureFailures";
export { qualityGateIndexFailures } from "./sampleQualityGateFailures";
