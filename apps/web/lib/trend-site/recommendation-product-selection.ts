import type { Article, Product } from "./types";

export function selectRecommendationCandidateProducts(article: Article, products: Product[]) {
  if (article.productCategory) {
    return products.filter((product) => product.category === article.productCategory && product.productRole === "main");
  }
  return products.filter((product) => product.productRole === "main");
}
