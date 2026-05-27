import { articlePath } from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";

export function reviewPathForProduct(locale: Article["locale"], product: Product, allArticles: Article[]) {
  const review =
    allArticles.find(
      (candidate) =>
        candidate.locale === locale &&
        candidate.type === "review" &&
        candidate.productId === product.id &&
        candidate.publishStatus === "published" &&
        candidate.indexStatus === "index"
    ) ??
    allArticles.find(
      (candidate) =>
        candidate.locale === locale &&
        candidate.type === "review" &&
        candidate.productId === product.id &&
        candidate.publishStatus === "published"
    );

  return review ? articlePath(review) : undefined;
}
