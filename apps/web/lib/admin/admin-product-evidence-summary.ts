import type { ProductEvidenceProduct } from "./admin-product-evidence-types";

export function productEvidenceSummary(product: ProductEvidenceProduct) {
  return [
    `${product.sellerClaims.length + product.verifiedClaims.length} claims`,
    `${product.marketRisks.length} risks`,
    `${product.variants.length} variants`
  ];
}
