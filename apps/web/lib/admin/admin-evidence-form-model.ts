import { emptyEvidencePackJson } from "./admin-form-utils";

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

export const evidenceRecordReturnTo = {
  product: "/admin/products/",
  variant: "/admin/products/",
  sellerClaim: "/admin/evidence/",
  verifiedClaim: "/admin/evidence/",
  marketRisk: "/admin/evidence/",
  evidencePack: "/admin/evidence/"
} as const;

export function productOptionRows(products: ProductOptionSource[]) {
  return products.map((product) => ({
    value: product.id,
    label: product.canonicalName
  }));
}

export function verifiedClaimOptionRows(products: VerifiedClaimOptionProductSource[]) {
  return products.flatMap((product) =>
    product.verifiedClaims.map((claim) => ({
      id: claim.id,
      label: verifiedClaimOptionLabel(product.canonicalName, claim)
    }))
  );
}

export function verifiedClaimOptionLabel(
  productName: string,
  claim: { testType: string; resultValue: string; unit?: string | null }
) {
  return `${productName}: ${claim.testType} ${claim.resultValue}${claim.unit ? ` ${claim.unit}` : ""}`;
}

export function labEvidenceAssetOptionLabel(asset: LabEvidenceAssetOptionSource) {
  return `${asset.fileName} - ${asset.measurementType}`;
}

export function evidencePackJsonTextareaValue(packJson?: unknown) {
  return JSON.stringify(packJson ?? emptyEvidencePackJson(), null, 2);
}
