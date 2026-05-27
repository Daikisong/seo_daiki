import type {
  LabEvidenceAssetOptionSource,
  ProductOptionSource,
  VerifiedClaimOptionProductSource
} from "./admin-evidence-form-types";

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
