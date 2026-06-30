import type { Article, Product } from "@/lib/trend-site/types";
import {
  TrendCommerceSection,
  TrendEditorialSections,
  TrendMarketplaceRule,
  TrendSignalBox,
} from "./article-type-content-parts";

export function ArticleTypeContent({
  article,
  products,
}: {
  article: Article;
  products: Product[];
}) {
  const [quickAnswer, ...buyerContextSections] = article.sections;
  const preProductSections = buyerContextSections.filter(
    isPreProductContextSection,
  );
  const postFinalThoughtSections = buyerContextSections.filter(
    isPostFinalThoughtSection,
  );

  return (
    <>
      <TrendSignalBox article={article} />
      {quickAnswer ? (
        <TrendEditorialSections article={article} sections={[quickAnswer]} />
      ) : null}
      <TrendMarketplaceRule article={article} />
      <TrendCommerceSection
        article={article}
        buyerContextSections={preProductSections}
        postFinalThoughtSections={postFinalThoughtSections}
        products={products}
      />
    </>
  );
}

function isPostFinalThoughtSection(section: Article["sections"][number]) {
  return (
    section.role === "category-clarification" ||
    section.role === "alternative-comparison"
  );
}

function isPreProductContextSection(section: Article["sections"][number]) {
  return !isPostFinalThoughtSection(section);
}
