import assert from "node:assert/strict";
import { validateArticleSchema as directArticle } from "../packages/validators/src/structuredDataArticleSchema";
import { validateBreadcrumbSchema as directBreadcrumb } from "../packages/validators/src/structuredDataBreadcrumbSchema";
import {
  validateCollectionSchema as directCollection,
  validateDatasetSchema as directDataset
} from "../packages/validators/src/structuredDataPageSchemas";
import { validateProductReviewSchema as directProductReview } from "../packages/validators/src/structuredDataProductReviewSchema";
import {
  validateArticleSchema,
  validateBreadcrumbSchema,
  validateCollectionSchema,
  validateDatasetSchema,
  validateProductReviewSchema
} from "../packages/validators/src/structuredDataSchemaValidators";

assert.equal(validateArticleSchema, directArticle);
assert.equal(validateBreadcrumbSchema, directBreadcrumb);
assert.equal(validateProductReviewSchema, directProductReview);
assert.equal(validateDatasetSchema, directDataset);
assert.equal(validateCollectionSchema, directCollection);

console.log("Structured data schema validator module export tests passed");
