import type { Article, Product } from "@global-import-lab/types";
import { reviewPathForProduct } from "@/lib/content/article-page-model";
import { AlternativesGrid } from "@/components/product/AlternativesGrid";
import { BenchmarkTable } from "@/components/data/BenchmarkTable";
import { BuyAvoidCard } from "@/components/product/BuyAvoidCard";
import { DatasetDownload } from "@/components/data/DatasetDownload";
import { EvidenceList } from "@/components/product/EvidenceList";
import { MarketRiskMatrix } from "@/components/product/MarketRiskMatrix";
import { PriceTruthCard } from "@/components/product/PriceTruthCard";
import { ProductComparisonTable } from "@/components/compare/ProductComparisonTable";
import { ReviewSignalSummary } from "@/components/product/ReviewSignalSummary";
import { ScoreBreakdown } from "@/components/compare/ScoreBreakdown";
import { SellerClaimTable } from "@/components/product/SellerClaimTable";
import { SortableMetricTable } from "@/components/data/SortableMetricTable";
import { TestMethodBlock } from "@/components/product/TestMethodBlock";
import { UpdateLog } from "@/components/seo/UpdateLog";
import { UseCaseRecommendation } from "@/components/compare/UseCaseRecommendation";
import { VariantTrapMap } from "@/components/product/VariantTrapMap";
import { VerdictCard } from "@/components/product/VerdictCard";
import { VerifiedClaimTable } from "@/components/product/VerifiedClaimTable";

interface ArticleTypeContentProps {
  article: Article;
  product?: Product;
  allProducts: Product[];
  allArticles: Article[];
}

export function ArticleTypeContent({ article, product, allProducts, allArticles }: ArticleTypeContentProps) {
  const alternatives = allProducts.filter((item) => item.id !== product?.id).slice(0, 3);
  const alternativeLinks = alternatives.flatMap((item) => {
    const href = reviewPathForProduct(article.locale, item, allArticles);
    return href ? [{ product: item, href }] : [];
  });
  const categoryProducts = product ? allProducts.filter((item) => item.category === product.category) : allProducts;

  if (article.type === "review" && product) {
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
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "compare") {
    return (
      <>
        <ProductComparisonTable products={categoryProducts} />
        <ScoreBreakdown score={article.qualityScore} />
        <UseCaseRecommendation recommendation="Choose 65W for lower-cost travel charging. Choose 100W only when your laptop, cable, and plug setup can use the higher output." />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "data") {
    return (
      <>
        <BenchmarkTable products={categoryProducts} />
        <SortableMetricTable products={categoryProducts} />
        <DatasetDownload href={`/datasets/${article.slug}.csv`} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "lab") {
    return (
      <>
        <TestMethodBlock />
        <BenchmarkTable products={categoryProducts} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "guide") {
    return (
      <>
        <SectionGrid article={article} />
        {product ? <VariantTrapMap variants={product.variants} /> : null}
        {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "risk") {
    return (
      <>
        <SectionGrid article={article} />
        {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
        <ProductComparisonTable products={categoryProducts} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "trend") {
    return (
      <>
        <section className="grid gap-4 md:grid-cols-3">
          <TrendSignalCard label="Why it is rising" value="Growth, freshness, and repeated search-demand signals." />
          <TrendSignalCard label="Buyer problem" value="Separate useful demand from seller-led hype before drafting." />
          <TrendSignalCard label="Publishing rule" value="Keep noindex until evidence, links, and compliance gates pass." />
        </section>
        <SectionGrid article={article} />
        <ProductComparisonTable products={categoryProducts} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "buyer_guide") {
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
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "deal_watch") {
    return (
      <>
        <BuyAvoidCard
          buy="Buy only when the current offer stays inside the evidence-backed buy zone and the SKU matches the checked variant."
          avoid="Wait or avoid when the discount is unsupported, the shipped price is unclear, or the seller swaps variants."
        />
        {product ? <PriceTruthCard snapshots={product.priceSnapshots} /> : null}
        <SectionGrid article={article} />
        <ProductComparisonTable products={categoryProducts} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "ingredient_guide") {
    return (
      <>
        <section className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
          <h2 className="text-base font-semibold">Health content notice</h2>
          <p className="mt-2">
            This page is informational only, not medical advice. Readers should consult a qualified healthcare professional
            before using supplements, especially during pregnancy, medication use, or chronic conditions.
          </p>
        </section>
        <SectionGrid article={article} />
        <EvidenceList evidenceIds={article.evidenceIds} />
        <UpdateLog lastUpdated={article.lastUpdated} />
      </>
    );
  }

  if (article.type === "methodology") {
    return (
      <>
        <TestMethodBlock />
        <ScoreBreakdown score={article.qualityScore} />
        <SectionGrid article={article} />
        <EvidenceList evidenceIds={article.evidenceIds} />
      </>
    );
  }

  return (
    <>
      <ProductComparisonTable products={categoryProducts} />
      <SectionGrid article={article} />
      <EvidenceList evidenceIds={article.evidenceIds} />
      <UpdateLog lastUpdated={article.lastUpdated} />
    </>
  );
}

function TrendSignalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase text-teal-700">{label}</p>
      <p className="mt-2 text-sm text-neutral-700">{value}</p>
    </div>
  );
}

function SectionGrid({ article }: { article: Article }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {article.sections.map((section) => (
        <div className="rounded-md border border-neutral-200 bg-white p-4" key={section.heading}>
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <p className="mt-2 text-sm text-neutral-700">{section.body}</p>
        </div>
      ))}
    </section>
  );
}
