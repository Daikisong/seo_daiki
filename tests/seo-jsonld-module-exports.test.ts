import assert from "node:assert/strict";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd,
  buildProductSnippetJsonLd,
  buildReviewJsonLd
} from "../packages/seo/src/jsonld";
import {
  buildArticleJsonLd as directBuildArticleJsonLd,
  buildCollectionPageJsonLd as directBuildCollectionPageJsonLd,
  buildDatasetJsonLd as directBuildDatasetJsonLd
} from "../packages/seo/src/jsonld-content";
import {
  buildBreadcrumbJsonLd as directBuildBreadcrumbJsonLd,
  buildItemListJsonLd as directBuildItemListJsonLd
} from "../packages/seo/src/jsonld-navigation";
import {
  buildProductJsonLd as directBuildProductJsonLd,
  buildProductSnippetJsonLd as directBuildProductSnippetJsonLd,
  buildReviewJsonLd as directBuildReviewJsonLd
} from "../packages/seo/src/jsonld-product";

assert.equal(buildArticleJsonLd, directBuildArticleJsonLd);
assert.equal(buildCollectionPageJsonLd, directBuildCollectionPageJsonLd);
assert.equal(buildDatasetJsonLd, directBuildDatasetJsonLd);
assert.equal(buildBreadcrumbJsonLd, directBuildBreadcrumbJsonLd);
assert.equal(buildItemListJsonLd, directBuildItemListJsonLd);
assert.equal(buildProductJsonLd, directBuildProductJsonLd);
assert.equal(buildProductSnippetJsonLd, directBuildProductSnippetJsonLd);
assert.equal(buildReviewJsonLd, directBuildReviewJsonLd);

console.log("SEO JSON-LD module export tests passed");
