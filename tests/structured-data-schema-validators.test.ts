import assert from "node:assert/strict";
import {
  validateArticleSchema,
  validateBreadcrumbSchema,
  validateCollectionSchema,
  validateDatasetSchema,
  validateProductReviewSchema
} from "../packages/validators/src/structuredDataSchemaValidators";
import type { ValidationIssue } from "@global-import-lab/validators";

const canonical = "https://example.com/en/example-page/";

let issues: ValidationIssue[] = [];
validateArticleSchema(
  issues,
  {
    "@type": "Article",
    url: "https://example.com/en/example-page?utm_source=test#section",
    mainEntityOfPage: canonical,
    headline: "Useful guide",
    description: "Clear description",
    inLanguage: "en"
  },
  canonical
);
assert.deepEqual(issues, []);

issues = [];
validateArticleSchema(
  issues,
  {
    "@type": "Thing",
    url: "https://example.com/en/other-page/",
    mainEntityOfPage: "",
    headline: "",
    description: "   ",
    inLanguage: ""
  },
  canonical
);
assert.deepEqual(issueCodes(issues), [
  "schema_article_type_invalid",
  "schema_article_url_mismatch",
  "schema_article_main_entity_mismatch",
  "schema_article_headline_missing",
  "schema_article_description_missing",
  "schema_article_language_missing"
]);

issues = [];
validateBreadcrumbSchema(
  issues,
  {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", item: "https://example.com/en/" },
      { "@type": "ListItem", item: canonical }
    ]
  },
  canonical
);
assert.deepEqual(issues, []);

issues = [];
validateBreadcrumbSchema(
  issues,
  {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "Thing", item: "/relative/" },
      "bad row",
      { "@type": "ListItem", item: "https://example.com/en/wrong/" }
    ]
  },
  canonical
);
assert.deepEqual(issueCodes(issues), [
  "schema_breadcrumb_item_type_invalid",
  "schema_breadcrumb_url_not_absolute",
  "schema_breadcrumb_item_invalid",
  "schema_breadcrumb_current_url_mismatch"
]);

issues = [];
validateProductReviewSchema(
  issues,
  {
    "@type": "Product",
    name: "Example charger",
    review: {
      "@type": "Review",
      url: canonical,
      itemReviewed: { "@type": "Product", name: "Example charger" }
    },
    offers: { "@type": "Offer", url: canonical }
  },
  canonical
);
assert.deepEqual(issues, []);

issues = [];
validateProductReviewSchema(
  issues,
  {
    "@type": "Product",
    name: "",
    review: {
      "@type": "Thing",
      url: "https://example.com/en/wrong/",
      itemReviewed: { "@type": "Thing", name: "" }
    },
    offers: { "@type": "Thing", url: "https://example.com/en/wrong/" }
  },
  canonical
);
assert.deepEqual(issueCodes(issues), [
  "schema_product_name_missing",
  "schema_review_type_invalid",
  "schema_review_url_mismatch",
  "schema_review_item_type_invalid",
  "schema_review_item_name_missing",
  "schema_offer_type_invalid",
  "schema_offer_url_mismatch"
]);

issues = [];
validateDatasetSchema(issues, { "@type": "Dataset", url: canonical, name: "Dataset", description: "Rows" }, canonical);
assert.deepEqual(issues, []);

issues = [];
validateDatasetSchema(issues, { "@type": "Thing", url: "https://example.com/en/wrong/", name: "", description: "" }, canonical);
assert.deepEqual(issueCodes(issues), [
  "schema_dataset_type_invalid",
  "schema_dataset_url_mismatch",
  "schema_dataset_name_missing",
  "schema_dataset_description_missing"
]);

issues = [];
validateCollectionSchema(
  issues,
  {
    "@type": "CollectionPage",
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [{ "@type": "ListItem", name: "Guide", url: "https://example.com/en/guide/" }]
    }
  },
  canonical,
  1
);
assert.deepEqual(issues, []);

issues = [];
validateCollectionSchema(issues, { "@type": "CollectionPage", url: canonical }, canonical, 1);
assert.deepEqual(issueCodes(issues), ["schema_collection_main_entity_missing"]);

function issueCodes(rows: ValidationIssue[]) {
  return rows.map((issue) => issue.code);
}

console.log("Structured data schema validator unit tests passed");
