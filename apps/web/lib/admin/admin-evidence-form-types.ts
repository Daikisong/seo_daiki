export interface ProductOptionSource {
  id: string;
  canonicalName: string;
}

export interface VerifiedClaimOptionProductSource extends ProductOptionSource {
  verifiedClaims: Array<{
    id: string;
    testType: string;
    resultValue: string;
    unit?: string | null;
  }>;
}

export interface LabEvidenceAssetOptionSource {
  fileName: string;
  measurementType: string;
}
