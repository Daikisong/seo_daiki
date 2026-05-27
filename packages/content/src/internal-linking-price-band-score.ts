import type { Product } from "@global-import-lab/types";
import { priceBand } from "./internal-linking-article-signals";

export function priceBandScore(sourceProduct?: Product, candidateProduct?: Product) {
  const sourceBand = priceBand(sourceProduct);
  const candidateBand = priceBand(candidateProduct);

  if (!sourceBand || !candidateBand || sourceProduct?.id === candidateProduct?.id) {
    return 0;
  }

  if (sourceBand === candidateBand) {
    return 10;
  }

  return Math.abs(sourceBand - candidateBand) === 1 ? 5 : 0;
}
