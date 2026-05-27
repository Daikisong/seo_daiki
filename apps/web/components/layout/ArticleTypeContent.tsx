import {
  buildArticleTypeContentContext,
  type ArticleTypeContentProps
} from "./article-type-content-model";
import {
  BuyerGuideArticleContent,
  DealWatchArticleContent,
  ReviewArticleContent
} from "./article-type-commerce-renderers";
import {
  CompareArticleContent,
  DataArticleContent,
  DefaultArticleContent,
  GuideArticleContent,
  IngredientGuideArticleContent,
  LabArticleContent,
  MethodologyArticleContent,
  RiskArticleContent,
  TrendArticleContent
} from "./article-type-research-renderers";

export function ArticleTypeContent({ article, product, allProducts, allArticles }: ArticleTypeContentProps) {
  const context = buildArticleTypeContentContext({ article, product, allProducts, allArticles });

  if (article.type === "review" && product) {
    return <ReviewArticleContent context={context} />;
  }

  if (article.type === "compare") {
    return <CompareArticleContent context={context} />;
  }

  if (article.type === "data") {
    return <DataArticleContent context={context} />;
  }

  if (article.type === "lab") {
    return <LabArticleContent context={context} />;
  }

  if (article.type === "guide") {
    return <GuideArticleContent context={context} />;
  }

  if (article.type === "risk") {
    return <RiskArticleContent context={context} />;
  }

  if (article.type === "trend") {
    return <TrendArticleContent context={context} />;
  }

  if (article.type === "buyer_guide") {
    return <BuyerGuideArticleContent context={context} />;
  }

  if (article.type === "deal_watch") {
    return <DealWatchArticleContent context={context} />;
  }

  if (article.type === "ingredient_guide") {
    return <IngredientGuideArticleContent context={context} />;
  }

  if (article.type === "methodology") {
    return <MethodologyArticleContent context={context} />;
  }

  return <DefaultArticleContent context={context} />;
}
