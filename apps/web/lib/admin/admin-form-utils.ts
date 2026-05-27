export function adminFieldValue(value: string | number | undefined) {
  return value ?? "";
}

export function jobButtonLabel(jobType: string) {
  return `Queue ${jobType.replaceAll("_", " ")}`;
}

export function emptyEvidencePackJson() {
  return {
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [],
    allowedClaims: [],
    forbiddenClaims: []
  };
}
