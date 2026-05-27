import { AlternativesGrid } from "@/components/product/AlternativesGrid";
import { BuyAvoidCard } from "@/components/product/BuyAvoidCard";
import { MarketRiskMatrix } from "@/components/product/MarketRiskMatrix";
import { PriceTruthCard } from "@/components/product/PriceTruthCard";
import { ProductComparisonTable } from "@/components/compare/ProductComparisonTable";
import { ReviewSignalSummary } from "@/components/product/ReviewSignalSummary";
import { SellerClaimTable } from "@/components/product/SellerClaimTable";
import { VariantTrapMap } from "@/components/product/VariantTrapMap";
import { VerdictCard } from "@/components/product/VerdictCard";
import { VerifiedClaimTable } from "@/components/product/VerifiedClaimTable";
import type { ArticleTypeContentContext } from "./article-type-content-model";
import { ArticleEvidenceFooter, SectionGrid } from "./article-type-content-parts";

export function ReviewArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, product, alternativeLinks } = context;
  if (!product) {
    return null;
  }
  return (
    <>
      <VerdictCard
        verdict={article.summary}
        bestFor={["Travel backup", "Low-cost phone and tablet charging", "Buyers who check SKU options"]}
        avoidIf={["You need certified office equipment", "You need easy local returns", "You cannot verify plug and cable options"]}
      />
      <BuyAvoidCard
        buy="Buy only when the final shipped price stays below the buy zone and the selected SKU is the tested wattage."
        avoid="Avoid the cheapest option when it is a lower-wattage SKU under a high-wattage listing title."
      />
      <SellerClaimTable claims={product.sellerClaims} />
      <VerifiedClaimTable claims={product.verifiedClaims} />
      <VariantTrapMap variants={product.variants} />
      <PriceTruthCard snapshots={product.priceSnapshots} />
      <ReviewSignalSummary locale={article.locale} signals={product.reviewSignals} />
      <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} />
      {alternativeLinks.length > 0 ? <AlternativesGrid alternatives={alternativeLinks} /> : null}
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function BuyerGuideArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, product, categoryProducts } = context;
  return (
    <>
      <VerdictCard
        verdict={article.summary}
        bestFor={["Buyers comparing several imported options", "Readers who need local risk notes", "Shoppers who check evidence before clicking"]}
        avoidIf={["The offer has no verified claim trail", "The final shipped price is unclear", "The SKU differs from the evidence pack"]}
      />
      <SectionGrid article={article} />
      <ProductComparisonTable products={categoryProducts} />
      {product ? <VariantTrapMap variants={product.variants} /> : null}
      {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function DealWatchArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, product, categoryProducts } = context;
  return (
    <>
      <BuyAvoidCard
        buy="Buy only when the current offer stays inside the evidence-backed buy zone and the SKU matches the checked variant."
        avoid="Wait or avoid when the discount is unsupported, the shipped price is unclear, or the seller swaps variants."
      />
      {product ? <PriceTruthCard snapshots={product.priceSnapshots} /> : null}
      <SectionGrid article={article} />
      <ProductComparisonTable products={categoryProducts} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}
