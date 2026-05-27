export interface ProductEvidenceProduct {
  id: string;
  canonicalName: string;
  variants: Array<{ id: string; optionName: string }>;
  sellerClaims: Array<{ id: string; claimType: string; claimValue: string }>;
  verifiedClaims: Array<{ id: string; resultValue: string; testType: string }>;
  marketRisks: Array<{ id: string; locale: string; score: number }>;
}

export function productEvidenceSummary(product: ProductEvidenceProduct) {
  return [
    `${product.sellerClaims.length + product.verifiedClaims.length} claims`,
    `${product.marketRisks.length} risks`,
    `${product.variants.length} variants`
  ];
}

export function productVariantRows<TProduct extends ProductEvidenceProduct>(
  products: TProduct[]
): Array<{ product: TProduct; variant: TProduct["variants"][number] }> {
  return products.flatMap((product) =>
    product.variants.map((variant) => ({
      product,
      variant
    }))
  );
}

export function productSellerClaimRows<TProduct extends ProductEvidenceProduct>(
  products: TProduct[]
): Array<{ claim: TProduct["sellerClaims"][number]; label: string; product: TProduct }> {
  return products.flatMap((product) =>
    product.sellerClaims.map((claim) => ({
      claim,
      product,
      label: sellerClaimLabel(claim)
    }))
  );
}

export function productVerifiedClaimRows<TProduct extends ProductEvidenceProduct>(
  products: TProduct[]
): Array<{ claim: TProduct["verifiedClaims"][number]; label: string; product: TProduct }> {
  return products.flatMap((product) =>
    product.verifiedClaims.map((claim) => ({
      claim,
      product,
      label: verifiedClaimLabel(claim)
    }))
  );
}

export function productMarketRiskRows<TProduct extends ProductEvidenceProduct>(
  products: TProduct[]
): Array<{ product: TProduct; risk: TProduct["marketRisks"][number] }> {
  return products.flatMap((product) =>
    product.marketRisks.map((risk) => ({
      product,
      risk
    }))
  );
}

export function sellerClaimLabel(claim: { claimType: string; claimValue: string }) {
  return `${claim.claimType}: ${claim.claimValue}`;
}

export function verifiedClaimLabel(claim: { resultValue: string; testType: string }) {
  return `${claim.testType}: ${claim.resultValue}`;
}

export function nullableAdminText(value: string | null | undefined) {
  return value ?? "-";
}
