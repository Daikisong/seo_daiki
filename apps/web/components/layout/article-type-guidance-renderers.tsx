import { MarketRiskMatrix } from "@/components/product/MarketRiskMatrix";
import { ProductComparisonTable } from "@/components/compare/ProductComparisonTable";
import { VariantTrapMap } from "@/components/product/VariantTrapMap";
import type { ArticleTypeContentContext } from "./article-type-content-model";
import { ArticleEvidenceFooter, HealthContentNotice, SectionGrid, TrendSignalCards } from "./article-type-content-parts";

export function GuideArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, product } = context;
  return (
    <>
      <SectionGrid article={article} />
      {product ? <VariantTrapMap variants={product.variants} /> : null}
      {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function RiskArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, product, categoryProducts } = context;
  return (
    <>
      <SectionGrid article={article} />
      {product ? <MarketRiskMatrix locale={article.locale} risks={product.marketRisks} /> : null}
      <ProductComparisonTable products={categoryProducts} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function TrendArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, categoryProducts } = context;
  return (
    <>
      <TrendSignalCards />
      <SectionGrid article={article} />
      <ProductComparisonTable products={categoryProducts} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function IngredientGuideArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article } = context;
  return (
    <>
      <HealthContentNotice />
      <SectionGrid article={article} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function DefaultArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, categoryProducts } = context;
  return (
    <>
      <ProductComparisonTable products={categoryProducts} />
      <SectionGrid article={article} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}
