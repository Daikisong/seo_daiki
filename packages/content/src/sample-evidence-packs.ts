import type { EvidencePack, Locale, Product } from "@global-import-lab/types";

export function buildSampleEvidencePacks(products: Product[], createdAt: string): EvidencePack[] {
  return products.flatMap((product) =>
    (["en", "es", "pt-br"] as Locale[]).map((locale) => ({
      id: `ep-${product.slug}-${locale}`,
      productId: product.id,
      locale,
      packJson: {
        product: {
          id: product.id,
          canonicalName: product.canonicalName,
          slug: product.slug,
          category: product.category
        },
        variants: product.variants,
        sellerClaims: product.sellerClaims,
        verifiedClaims: product.verifiedClaims,
        reviewSignals: product.reviewSignals.filter((signal) => signal.locale === locale || signal.locale === "en"),
        priceSnapshots: product.priceSnapshots,
        marketRisks: product.marketRisks.filter((risk) => risk.locale === locale || risk.locale === "en"),
        allowedClaims: [
          "Seller claims must be labeled as seller claims until verified.",
          "Use sustained-output values only when a VerifiedClaim exists.",
          "Variant, plug, cable, customs, and return risks can be described from evidence."
        ],
        forbiddenClaims: [
          "Do not say safety certification is verified unless a certification evidence record exists.",
          "Do not copy review text.",
          "Do not say every SKU supports the headline wattage."
        ]
      },
      createdAt
    }))
  );
}
