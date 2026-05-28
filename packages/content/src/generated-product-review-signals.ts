import type { ReviewSignal } from "@global-import-lab/types";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export function buildGeneratedReviewSignals(spec: GeneratedProductSpec): ReviewSignal[] {
  return [
    {
      id: `rs-${spec.sourceSlug}-en`,
      productId: spec.id,
      locale: "en",
      topic: spec.riskTopic,
      sentiment: "negative",
      count: 7,
      confidence: 0.62,
      window: "90d"
    },
    {
      id: `rs-${spec.sourceSlug}-es`,
      productId: spec.id,
      locale: "es",
      topic: "confusion about selected variant",
      sentiment: "negative",
      count: 5,
      confidence: 0.58,
      window: "90d"
    },
    {
      id: `rs-${spec.sourceSlug}-pt`,
      productId: spec.id,
      locale: "pt-br",
      topic: "tax and return risk after import",
      sentiment: "negative",
      count: 6,
      confidence: 0.6,
      window: "90d"
    }
  ];
}
