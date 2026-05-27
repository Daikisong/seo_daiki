import type { Article, ArticleType } from "@global-import-lab/types";
import { localizedSectionPathForArticleType } from "./article-localized-section-routes";

export const sectionPathByType: Record<ArticleType, string> = {
  hub: "",
  review: "reviews",
  guide: "guides",
  compare: "compare",
  data: "data",
  lab: "lab",
  risk: "risk",
  methodology: "methodology",
  trend: "trends",
  buyer_guide: "buyer-guides",
  deal_watch: "deals",
  ingredient_guide: "ingredients"
};

export function sectionPathForArticle(article: Pick<Article, "locale" | "type">) {
  return localizedSectionPathForArticleType(article.type, article.locale) ?? sectionPathByType[article.type];
}
