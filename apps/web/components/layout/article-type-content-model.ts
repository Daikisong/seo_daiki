import type { Article, Product } from "@global-import-lab/types";
import { reviewPathForProduct } from "@/lib/content/article-page-model";

export interface ArticleTypeContentProps {
  article: Article;
  product?: Product;
  allProducts: Product[];
  allArticles: Article[];
}

export interface ArticleAlternativeLink {
  product: Product;
  href: string;
}

export interface ArticleTypeContentContext {
  article: Article;
  product?: Product;
  categoryProducts: Product[];
  alternativeLinks: ArticleAlternativeLink[];
}

export function buildArticleTypeContentContext({
  article,
  product,
  allProducts,
  allArticles
}: ArticleTypeContentProps): ArticleTypeContentContext {
  const alternatives = allProducts.filter((item) => item.id !== product?.id).slice(0, 3);
  const alternativeLinks = alternatives.flatMap((item) => {
    const href = reviewPathForProduct(article.locale, item, allArticles);
    return href ? [{ product: item, href }] : [];
  });
  const categoryProducts = product ? allProducts.filter((item) => item.category === product.category) : allProducts;
  const base = { article, categoryProducts, alternativeLinks };
  return product ? { ...base, product } : base;
}
