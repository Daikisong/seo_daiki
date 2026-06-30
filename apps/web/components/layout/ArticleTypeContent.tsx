import type { Article, Product } from "@/lib/trend-site/types";
import {
  TrendCommerceSection,
  TrendEditorialSections,
  TrendMarketplaceRule,
  TrendSignalBox
} from "./article-type-content-parts";

export function ArticleTypeContent({ article, products }: { article: Article; products: Product[] }) {
  const [quickAnswer, ...buyerContextSections] = article.sections;

  return (
    <>
      <TrendSignalBox article={article} />
      {quickAnswer ? <TrendEditorialSections article={article} sections={[quickAnswer]} /> : null}
      <TrendMarketplaceRule article={article} />
      <TrendCommerceSection article={article} buyerContextSections={buyerContextSections} products={products} />
    </>
  );
}
