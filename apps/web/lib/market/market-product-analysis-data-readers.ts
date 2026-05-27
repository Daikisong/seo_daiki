import { readMarketJson } from "./market-data-file";

export function readProductCandidateAnalysis() {
  return readMarketJson<{ analyses?: unknown[] }>("exports/product_candidate_analysis.json", { analyses: [] });
}
