export function uniqueRows<T>(rows: T[], keyFn: (row: T) => string) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = keyFn(row);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function variantKey(row: Record<string, unknown>) {
  return [row.option, row.optionName, row.source_sku, row.sourceSku].map(String).join("|");
}

export function claimKey(row: Record<string, unknown>) {
  return [row.claim_type, row.claimType, row.claim_value, row.claimValue, row.raw_text, row.rawText].map(String).join("|");
}

export function verifiedClaimKey(row: Record<string, unknown>) {
  return [
    row.test_type,
    row.testType,
    row.result_value,
    row.resultValue,
    row.unit,
    row.method,
    row.evidence_url,
    row.evidenceUrl
  ].map(String).join("|");
}

export function signalKey(row: Record<string, unknown>) {
  return [row.locale, row.topic, row.sentiment, row.window].map(String).join("|");
}

export function priceKey(row: Record<string, unknown>) {
  return [row.country, row.currency, row.price, row.shipping, row.final_price, row.finalPrice].map(String).join("|");
}

export function riskKey(row: Record<string, unknown>) {
  return [row.locale, row.country].map(String).join("|");
}
