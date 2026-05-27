import {
  requireSchemaType,
  requireUrlField
} from "./structuredDataRules";
import type { ValidationIssue } from "./types";
import { arrayField, isRecord, stringField } from "./validationUtils";

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
