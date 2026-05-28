import type { ArticleDraft } from "./article-draft-types";
import {
  buildTrendBlogArticle,
  buildTrendBlogDraftArticles as buildTrendBlogDraftArticlesFromSpecs
} from "./trend-blog-article-builder";
import type { TrendBlogArticleContext, TrendBlogArticleSpec } from "./trend-blog-article-types";
import { gan65wDealWatchSpecs } from "./trend-blog-65w-deal-watch-specs";
import { magnesiumIngredientGuideSpecs } from "./trend-blog-magnesium-ingredient-specs";
import { travelGanBuyerGuideSpecs } from "./trend-blog-travel-gan-buyer-guide-specs";
import { travelGanTrendSpecs } from "./trend-blog-travel-gan-trend-specs";

export type { TrendBlogArticleContext, TrendBlogArticleSpec, TrendBlogArticleType } from "./trend-blog-article-types";
export { buildTrendBlogArticle };
export { gan65wDealWatchSpecs } from "./trend-blog-65w-deal-watch-specs";
export { magnesiumIngredientGuideSpecs } from "./trend-blog-magnesium-ingredient-specs";
export { travelGanBuyerGuideSpecs } from "./trend-blog-travel-gan-buyer-guide-specs";
export { travelGanTrendSpecs } from "./trend-blog-travel-gan-trend-specs";

export const trendBlogArticleSpecs: TrendBlogArticleSpec[] = [
  ...travelGanTrendSpecs,
  ...travelGanBuyerGuideSpecs,
  ...gan65wDealWatchSpecs,
  ...magnesiumIngredientGuideSpecs
];

export function buildTrendBlogDraftArticles(
  context: TrendBlogArticleContext,
  specs: TrendBlogArticleSpec[] = trendBlogArticleSpecs
): ArticleDraft[] {
  return buildTrendBlogDraftArticlesFromSpecs(context, specs);
}
