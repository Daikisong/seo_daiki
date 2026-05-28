import assert from "node:assert/strict";
import {
  generateArticleMetadata as directArticleMetadata,
  generateCountryRiskGuideMetadata as directCountryRiskGuideMetadata,
  generateFixedLocaleGuideMetadata as directFixedLocaleGuideMetadata,
  metadataForRenderableArticle as directMetadataForRenderableArticle
} from "../apps/web/lib/content/article-metadata-loaders";
import { generateCountryRiskGuideMetadata as countryRiskGuideMetadata } from "../apps/web/lib/content/article-metadata-country-risk";
import { generateFixedLocaleGuideMetadata as fixedLocaleGuideMetadata } from "../apps/web/lib/content/article-metadata-fixed-locale";
import { metadataForRenderableArticle } from "../apps/web/lib/content/article-metadata-renderer";
import { generateArticleMetadata as articleMetadata } from "../apps/web/lib/content/article-metadata-standard";
import { loadArticlePage as directArticleLoader } from "../apps/web/lib/content/article-page-loaders";
import { staticParamsFor as directStaticParams } from "../apps/web/lib/content/article-static-params";
import {
  generateArticleMetadata,
  loadArticlePage,
  staticParamsFor
} from "../apps/web/lib/content/page-loaders";

assert.strictEqual(loadArticlePage, directArticleLoader);
assert.strictEqual(generateArticleMetadata, directArticleMetadata);
assert.strictEqual(generateArticleMetadata, articleMetadata);
assert.strictEqual(directCountryRiskGuideMetadata, countryRiskGuideMetadata);
assert.strictEqual(directFixedLocaleGuideMetadata, fixedLocaleGuideMetadata);
assert.strictEqual(directMetadataForRenderableArticle, metadataForRenderableArticle);
assert.strictEqual(staticParamsFor, directStaticParams);

console.log("Page loader module export tests passed");
