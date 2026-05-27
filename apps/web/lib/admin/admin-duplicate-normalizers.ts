import { isRecord, numberFromUnknown, stringFromUnknown } from "./admin-section-utils";

export function duplicateCandidateCountsFromRows(rows: unknown[]) {
  const counts: Record<string, number> = {};

  for (const row of rows) {
    if (!isRecord(row)) {
      continue;
    }
    const canonicalProduct = isRecord(row.canonical_product) ? row.canonical_product : {};
    const productIds = new Set<string>();
    const canonicalProductId = stringFromUnknown(canonicalProduct.product_id);
    if (canonicalProductId) {
      productIds.add(canonicalProductId);
    }
    if (Array.isArray(row.source_product_ids)) {
      for (const productId of row.source_product_ids) {
        const value = stringFromUnknown(productId);
        if (value) {
          productIds.add(value);
        }
      }
    }

    const candidates = Array.isArray(row.duplicate_candidates) ? row.duplicate_candidates : [];
    const actionableCount = candidates.filter((candidate) => {
      if (!isRecord(candidate)) {
        return false;
      }
      const decision = stringFromUnknown(candidate.decision);
      const confidence = numberFromUnknown(candidate.confidence);
      return decision !== "keep_separate" || confidence >= 0.5;
    }).length;

    for (const productId of productIds) {
      counts[productId] = actionableCount;
    }
  }

  return counts;
}
