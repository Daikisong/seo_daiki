import { arrayField, isRecord, stringField } from "./validationUtils";
import type { ValidationIssue } from "./types";
import { requireSchemaType, requireTextField } from "./structuredDataFieldRules";

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
