import { notFound } from "next/navigation";
import type { ArticleType, Article } from "@global-import-lab/types";
import { isLocale } from "@/lib/i18n/locales";
import { assertPublicArticleVisible } from "./article-visibility";
import type { ArticleRouteParams, PreviewSearchParamsPromise } from "./page-loader-types";
import { getAllArticles, getAllProducts, getArticle, getProduct } from "./repository";

export async function loadArticlePage(
  paramsPromise: Promise<ArticleRouteParams>,
  type: ArticleType,
  searchParamsPromise?: PreviewSearchParamsPromise
) {
  const params = await paramsPromise;
  if (!isLocale(params.locale)) {
    notFound();
  }

  const article = await getArticle(params.locale, type, params.slug);
  if (!article) {
    notFound();
  }

  await assertPublicArticleVisible(article, searchParamsPromise);
  return articlePageDataForArticle(article);
}

export async function articlePageDataForArticle(article: Article) {
  return {
    article,
    product: await getProduct(article.productId),
    allProducts: await getAllProducts(),
    allArticles: await getAllArticles()
  };
}
