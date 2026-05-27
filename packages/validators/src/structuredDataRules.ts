import type { Article } from "@global-import-lab/types";
import { absoluteUrl } from "@global-import-lab/seo";
import { arrayField, isRecord, normalizeUrl, stringField } from "./validationUtils";
import type { ValidationIssue } from "./types";

export function validateItemListSchema(
  issues: ValidationIssue[],
  itemList: Record<string, unknown>,
  code: string,
  expectedItems: number
) {
  requireSchemaType(issues, itemList, "ItemList", code, "ItemList JSON-LD must use @type ItemList.");

  const elements = arrayField(itemList, "itemListElement");
  if (elements.length !== expectedItems) {
    issues.push({
      code,
      message: `ItemList JSON-LD should expose ${expectedItems} items; found ${elements.length}.`,
      severity: "blocker"
    });
  }

  for (const element of elements) {
    if (!isRecord(element)) {
      issues.push({
        code,
        message: "ItemList JSON-LD list items must be objects.",
        severity: "blocker"
      });
      continue;
    }

    requireSchemaType(issues, element, "ListItem", code, "ItemList JSON-LD entries must use @type ListItem.");
    requireTextField(issues, element, "name", code, "ItemList JSON-LD entries need a name.");
    const url = stringField(element, "url");
    if (!url || !/^https?:\/\//i.test(url)) {
      issues.push({
        code,
        message: "ItemList JSON-LD entries need absolute URLs.",
        severity: "blocker"
      });
    }
  }
}

export function internalLinkSchemaItems(article: Pick<Article, "internalLinks">) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}

export function requireSchemaType(
  issues: ValidationIssue[],
  schema: Record<string, unknown>,
  expectedType: string,
  code: string,
  message: string
) {
  if (stringField(schema, "@type") !== expectedType) {
    issues.push({ code, message, severity: "blocker" });
  }
}

export function requireTextField(
  issues: ValidationIssue[],
  schema: Record<string, unknown>,
  field: string,
  code: string,
  message: string
) {
  if (!stringField(schema, field)?.trim()) {
    issues.push({ code, message, severity: "blocker" });
  }
}

export function requireUrlField(
  issues: ValidationIssue[],
  schema: Record<string, unknown>,
  field: string,
  expectedUrl: string,
  code: string,
  message: string
) {
  const value = stringField(schema, field);
  if (!value || normalizeUrl(value) !== normalizeUrl(expectedUrl)) {
    issues.push({ code, message, severity: "blocker" });
  }
}
