import assert from "node:assert/strict";
import {
  getAllArticles,
  getAllEvidencePacks,
  getAllProducts,
  getArticle,
  getArticlesByType,
  getEvidencePack,
  getIndexedArticles,
  getLocaleArticles,
  getProduct,
  getProductsByCategory,
  getStaticArticleParams
} from "../apps/web/lib/content/repository";
import {
  getAllArticles as directGetAllArticles,
  getArticle as directGetArticle,
  getArticlesByType as directGetArticlesByType,
  getIndexedArticles as directGetIndexedArticles,
  getLocaleArticles as directGetLocaleArticles,
  getStaticArticleParams as directGetStaticArticleParams
} from "../apps/web/lib/content/article-repository";
import {
  getAllEvidencePacks as directGetAllEvidencePacks,
  getAllProducts as directGetAllProducts,
  getEvidencePack as directGetEvidencePack,
  getProduct as directGetProduct,
  getProductsByCategory as directGetProductsByCategory
} from "../apps/web/lib/content/product-repository";

assert.equal(getArticle, directGetArticle);
assert.equal(getLocaleArticles, directGetLocaleArticles);
assert.equal(getIndexedArticles, directGetIndexedArticles);
assert.equal(getAllArticles, directGetAllArticles);
assert.equal(getArticlesByType, directGetArticlesByType);
assert.equal(getStaticArticleParams, directGetStaticArticleParams);

assert.equal(getProduct, directGetProduct);
assert.equal(getEvidencePack, directGetEvidencePack);
assert.equal(getAllEvidencePacks, directGetAllEvidencePacks);
assert.equal(getProductsByCategory, directGetProductsByCategory);
assert.equal(getAllProducts, directGetAllProducts);

const previousContentSource = process.env.CONTENT_SOURCE;
delete process.env.CONTENT_SOURCE;

async function main() {
  const article = await getArticle("en", "review", "baseus-65w-gan-charger-real-output");
  const indexedArticles = await getIndexedArticles();
  const products = await getAllProducts();

  assert.ok(article);
  assert.equal(indexedArticles.every((item) => item.indexStatus === "index" && item.publishStatus === "published"), true);
  assert.ok(products.length > 0);
}

main()
  .then(() => {
    if (previousContentSource === undefined) {
      delete process.env.CONTENT_SOURCE;
    } else {
      process.env.CONTENT_SOURCE = previousContentSource;
    }

    console.log("Content repository module tests passed");
  })
  .catch((error) => {
    if (previousContentSource === undefined) {
      delete process.env.CONTENT_SOURCE;
    } else {
      process.env.CONTENT_SOURCE = previousContentSource;
    }
    throw error;
  });
