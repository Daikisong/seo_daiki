import type { Article, Product } from "./types";

export function selectRecommendationCandidateProducts(
  article: Article,
  products: Product[],
) {
  if (!article.productCategory) {
    return [];
  }
  return products.filter(
    (product) =>
      product.category === article.productCategory &&
      product.productRole === "main",
  );
}
