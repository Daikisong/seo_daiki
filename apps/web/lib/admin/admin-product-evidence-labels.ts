export function sellerClaimLabel(claim: { claimType: string; claimValue: string }) {
  return `${claim.claimType}: ${claim.claimValue}`;
}

export function verifiedClaimLabel(claim: { resultValue: string; testType: string }) {
  return `${claim.testType}: ${claim.resultValue}`;
}

export function nullableAdminText(value: string | null | undefined) {
  return value ?? "-";
}
