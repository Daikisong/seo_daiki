import { BenchmarkTable } from "@/components/data/BenchmarkTable";
import { DatasetDownload } from "@/components/data/DatasetDownload";
import { ProductComparisonTable } from "@/components/compare/ProductComparisonTable";
import { ScoreBreakdown } from "@/components/compare/ScoreBreakdown";
import { SortableMetricTable } from "@/components/data/SortableMetricTable";
import { TestMethodBlock } from "@/components/product/TestMethodBlock";
import { UseCaseRecommendation } from "@/components/compare/UseCaseRecommendation";
import type { ArticleTypeContentContext } from "./article-type-content-model";
import { ArticleEvidenceFooter, SectionGrid } from "./article-type-content-parts";

export function CompareArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, categoryProducts } = context;
  return (
    <>
      <ProductComparisonTable products={categoryProducts} />
      <ScoreBreakdown score={article.qualityScore} />
      <UseCaseRecommendation recommendation="Choose 65W for lower-cost travel charging. Choose 100W only when your laptop, cable, and plug setup can use the higher output." />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function DataArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, categoryProducts } = context;
  return (
    <>
      <BenchmarkTable products={categoryProducts} />
      <SortableMetricTable products={categoryProducts} />
      <DatasetDownload href={`/datasets/${article.slug}.csv`} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function LabArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article, categoryProducts } = context;
  return (
    <>
      <TestMethodBlock />
      <BenchmarkTable products={categoryProducts} />
      <ArticleEvidenceFooter article={article} />
    </>
  );
}

export function MethodologyArticleContent({ context }: { context: ArticleTypeContentContext }) {
  const { article } = context;
  return (
    <>
      <TestMethodBlock />
      <ScoreBreakdown score={article.qualityScore} />
      <SectionGrid article={article} />
      <ArticleEvidenceFooter article={article} includeUpdateLog={false} />
    </>
  );
}
