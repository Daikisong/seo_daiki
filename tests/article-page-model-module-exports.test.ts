import assert from "node:assert/strict";
import {
  affiliateTrackingHrefForArticle,
  breadcrumbItemsForArticle,
  buildArticlePageJsonLd,
  internalLinkSchemaItems,
  reviewPathForProduct,
  unsafeAffiliateTargetRedirectAllowed
} from "../apps/web/lib/content/article-page-model";
import {
  affiliateTrackingHrefForArticle as directAffiliateTrackingHrefForArticle,
  unsafeAffiliateTargetRedirectAllowed as directUnsafeAffiliateTargetRedirectAllowed
} from "../apps/web/lib/content/article-affiliate-tracking";
import { breadcrumbItemsForArticle as directBreadcrumbItemsForArticle } from "../apps/web/lib/content/article-page-breadcrumbs";
import {
  buildArticlePageJsonLd as directBuildArticlePageJsonLd,
  internalLinkSchemaItems as directInternalLinkSchemaItems
} from "../apps/web/lib/content/article-page-jsonld";
import { reviewPathForProduct as directReviewPathForProduct } from "../apps/web/lib/content/article-review-linking";

assert.equal(affiliateTrackingHrefForArticle, directAffiliateTrackingHrefForArticle);
assert.equal(unsafeAffiliateTargetRedirectAllowed, directUnsafeAffiliateTargetRedirectAllowed);
assert.equal(breadcrumbItemsForArticle, directBreadcrumbItemsForArticle);
assert.equal(buildArticlePageJsonLd, directBuildArticlePageJsonLd);
assert.equal(internalLinkSchemaItems, directInternalLinkSchemaItems);
assert.equal(reviewPathForProduct, directReviewPathForProduct);

console.log("Article page model module export tests passed");
