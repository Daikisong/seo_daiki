import {
  requireSchemaType,
  requireTextField,
  requireUrlField
} from "./structuredDataRules";
import type { ValidationIssue } from "./types";
import { recordField } from "./validationUtils";

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
