import assert from "node:assert/strict";
import { generateArticleMetadata as directArticleMetadata } from "../apps/web/lib/content/article-metadata-loaders";
import { loadArticlePage as directArticleLoader } from "../apps/web/lib/content/article-page-loaders";
import { staticParamsFor as directStaticParams } from "../apps/web/lib/content/article-static-params";
import {
  generateArticleMetadata,
  loadArticlePage,
  staticParamsFor
} from "../apps/web/lib/content/page-loaders";

assert.strictEqual(loadArticlePage, directArticleLoader);
assert.strictEqual(generateArticleMetadata, directArticleMetadata);
assert.strictEqual(staticParamsFor, directStaticParams);

console.log("Page loader module export tests passed");
