export interface ProductEvidenceProduct {
  id: string;
  canonicalName: string;
  variants: Array<{ id: string; optionName: string }>;
  sellerClaims: Array<{ id: string; claimType: string; claimValue: string }>;
  verifiedClaims: Array<{ id: string; resultValue: string; testType: string }>;
  marketRisks: Array<{ id: string; locale: string; score: number }>;
}
