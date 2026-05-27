import type { ProductEvidenceProduct } from "./admin-product-evidence-types";
import {
  sellerClaimLabel,
  verifiedClaimLabel
} from "./admin-product-evidence-labels";

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
