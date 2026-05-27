import {
  requireSchemaType,
  requireTextField,
  requireUrlField,
  validateItemListSchema
} from "./structuredDataRules";
import { arrayField, isRecord, recordField, stringField } from "./validationUtils";
import type { ValidationIssue } from "./types";

export function validateArticleSchema(
  issues: ValidationIssue[],
  articleJsonLd: Record<string, unknown>,
  canonical: string
) {
  requireSchemaType(issues, articleJsonLd, "Article", "schema_article_type_invalid", "Article JSON-LD must use @type Article.");
  requireUrlField(
    issues,
    articleJsonLd,
    "url",
    canonical,
    "schema_article_url_mismatch",
    "Article JSON-LD url must match the canonical URL."
  );
  requireUrlField(
    issues,
    articleJsonLd,
    "mainEntityOfPage",
    canonical,
    "schema_article_main_entity_mismatch",
    "Article JSON-LD mainEntityOfPage must match the canonical URL."
  );
  requireTextField(issues, articleJsonLd, "headline", "schema_article_headline_missing", "Article JSON-LD needs a headline.");
  requireTextField(
    issues,
    articleJsonLd,
    "description",
    "schema_article_description_missing",
    "Article JSON-LD needs a description."
  );
  requireTextField(
    issues,
    articleJsonLd,
    "inLanguage",
    "schema_article_language_missing",
    "Article JSON-LD needs an inLanguage value."
  );
}

export function validateBreadcrumbSchema(
  issues: ValidationIssue[],
  breadcrumbs: Record<string, unknown>,
  canonical: string
) {
  requireSchemaType(
    issues,
    breadcrumbs,
    "BreadcrumbList",
    "schema_breadcrumb_type_invalid",
    "Breadcrumb JSON-LD must use @type BreadcrumbList."
  );

  const elements = arrayField(breadcrumbs, "itemListElement");
  if (elements.length < 2) {
    issues.push({
      code: "schema_breadcrumb_items_low",
      message: "Breadcrumb JSON-LD needs at least home and current-page list items.",
      severity: "blocker"
    });
    return;
  }

  for (const element of elements) {
    if (!isRecord(element)) {
      issues.push({
        code: "schema_breadcrumb_item_invalid",
        message: "Breadcrumb JSON-LD list items must be objects.",
        severity: "blocker"
      });
      continue;
    }

    requireSchemaType(
      issues,
      element,
      "ListItem",
      "schema_breadcrumb_item_type_invalid",
      "Breadcrumb JSON-LD item must use @type ListItem."
    );

    const item = stringField(element, "item");
    if (!item || !/^https?:\/\//i.test(item)) {
      issues.push({
        code: "schema_breadcrumb_url_not_absolute",
        message: "Breadcrumb JSON-LD item URLs must be absolute.",
        severity: "blocker"
      });
    }
  }

  const currentPage = elements.at(-1);
  if (isRecord(currentPage)) {
    requireUrlField(
      issues,
      currentPage,
      "item",
      canonical,
      "schema_breadcrumb_current_url_mismatch",
      "Breadcrumb JSON-LD current-page item must match the canonical URL."
    );
  }
}

export function validateProductReviewSchema(
  issues: ValidationIssue[],
  productJsonLd: Record<string, unknown>,
  canonical: string
) {
  requireSchemaType(issues, productJsonLd, "Product", "schema_product_type_invalid", "Product JSON-LD must use @type Product.");
  requireTextField(issues, productJsonLd, "name", "schema_product_name_missing", "Product JSON-LD needs a name.");

  const review = recordField(productJsonLd, "review");
  if (!review) {
    issues.push({
      code: "schema_review_missing",
      message: "Review pages must emit nested Review JSON-LD inside Product JSON-LD.",
      severity: "blocker"
    });
  } else {
    requireSchemaType(issues, review, "Review", "schema_review_type_invalid", "Nested review JSON-LD must use @type Review.");
    requireUrlField(
      issues,
      review,
      "url",
      canonical,
      "schema_review_url_mismatch",
      "Nested Review JSON-LD url must match the canonical URL."
    );

    const itemReviewed = recordField(review, "itemReviewed");
    if (!itemReviewed) {
      issues.push({
        code: "schema_review_item_missing",
        message: "Nested Review JSON-LD must include itemReviewed product data.",
        severity: "blocker"
      });
    } else {
      requireSchemaType(
        issues,
        itemReviewed,
        "Product",
        "schema_review_item_type_invalid",
        "Review itemReviewed must use @type Product."
      );
      requireTextField(
        issues,
        itemReviewed,
        "name",
        "schema_review_item_name_missing",
        "Review itemReviewed needs a product name."
      );
    }
  }

  const offers = recordField(productJsonLd, "offers");
  if (offers) {
    requireSchemaType(issues, offers, "Offer", "schema_offer_type_invalid", "Product offer JSON-LD must use @type Offer.");
    requireUrlField(
      issues,
      offers,
      "url",
      canonical,
      "schema_offer_url_mismatch",
      "Product offer JSON-LD url must match the review canonical URL."
    );
  }
}

export function validateDatasetSchema(
  issues: ValidationIssue[],
  dataset: Record<string, unknown>,
  canonical: string
) {
  requireSchemaType(issues, dataset, "Dataset", "schema_dataset_type_invalid", "Data pages must emit Dataset JSON-LD.");
  requireUrlField(
    issues,
    dataset,
    "url",
    canonical,
    "schema_dataset_url_mismatch",
    "Dataset JSON-LD url must match the canonical URL."
  );
  requireTextField(issues, dataset, "name", "schema_dataset_name_missing", "Dataset JSON-LD needs a name.");
  requireTextField(
    issues,
    dataset,
    "description",
    "schema_dataset_description_missing",
    "Dataset JSON-LD needs a description."
  );
}

export function validateCollectionSchema(
  issues: ValidationIssue[],
  collection: Record<string, unknown>,
  canonical: string,
  expectedItems: number
) {
  requireSchemaType(
    issues,
    collection,
    "CollectionPage",
    "schema_collection_type_invalid",
    "Hub pages must emit CollectionPage JSON-LD."
  );
  requireUrlField(
    issues,
    collection,
    "url",
    canonical,
    "schema_collection_url_mismatch",
    "CollectionPage JSON-LD url must match the canonical URL."
  );

  const mainEntity = recordField(collection, "mainEntity");
  if (!mainEntity) {
    issues.push({
      code: "schema_collection_main_entity_missing",
      message: "CollectionPage JSON-LD must include an ItemList mainEntity.",
      severity: "blocker"
    });
    return;
  }

  validateItemListSchema(issues, mainEntity, "schema_collection_item_list_invalid", expectedItems);
}
