import assert from "node:assert/strict";
import {
  internalLinkSchemaItems,
  requireSchemaType,
  requireTextField,
  requireUrlField,
  validateItemListSchema
} from "../packages/validators/src/structuredDataRules";
import {
  requireSchemaType as directRequireSchemaType,
  requireTextField as directRequireTextField,
  requireUrlField as directRequireUrlField
} from "../packages/validators/src/structuredDataFieldRules";
import { internalLinkSchemaItems as directInternalLinkSchemaItems } from "../packages/validators/src/structuredDataInternalLinks";
import { validateItemListSchema as directValidateItemListSchema } from "../packages/validators/src/structuredDataItemListRules";
import type { ValidationIssue } from "@global-import-lab/validators";

assert.equal(requireSchemaType, directRequireSchemaType);
assert.equal(requireTextField, directRequireTextField);
assert.equal(requireUrlField, directRequireUrlField);
assert.equal(internalLinkSchemaItems, directInternalLinkSchemaItems);
assert.equal(validateItemListSchema, directValidateItemListSchema);

const issues: ValidationIssue[] = [];

requireSchemaType(issues, { "@type": "Article" }, "Article", "schema_article_type_invalid", "wrong type");
assert.deepEqual(issues, []);

requireSchemaType(issues, { "@type": "Thing" }, "Article", "schema_article_type_invalid", "wrong type");
assert.deepEqual(issueCodes(issues), ["schema_article_type_invalid"]);

issues.length = 0;
requireTextField(issues, { name: "Valid name" }, "name", "schema_name_missing", "missing name");
requireTextField(issues, { name: "   " }, "name", "schema_name_missing", "missing name");
requireTextField(issues, {}, "name", "schema_name_missing", "missing name");
assert.deepEqual(issueCodes(issues), ["schema_name_missing", "schema_name_missing"]);

issues.length = 0;
requireUrlField(
  issues,
  { url: "https://example.com/en/page?utm_source=test#section" },
  "url",
  "https://example.com/en/page/",
  "schema_url_mismatch",
  "url mismatch"
);
assert.deepEqual(issues, []);

requireUrlField(
  issues,
  { url: "https://example.com/en/other/" },
  "url",
  "https://example.com/en/page/",
  "schema_url_mismatch",
  "url mismatch"
);
assert.deepEqual(issueCodes(issues), ["schema_url_mismatch"]);

issues.length = 0;
validateItemListSchema(
  issues,
  {
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", name: "Valid", url: "https://example.com/en/valid/" },
      { "@type": "ListItem", name: "", url: "/relative/" },
      "bad row"
    ]
  },
  "schema_item_list_invalid",
  2
);
assert.deepEqual(issueCodes(issues), [
  "schema_item_list_invalid",
  "schema_item_list_invalid",
  "schema_item_list_invalid",
  "schema_item_list_invalid"
]);

assert.deepEqual(
  internalLinkSchemaItems({
    internalLinks: [
      { label: "Relative", href: "/en/relative/", reason: "guide" },
      { label: "Absolute", href: "https://publisher.example/path/", reason: "data" }
    ]
  }),
  [
    { name: "Relative", url: "https://example.com/en/relative/" },
    { name: "Absolute", url: "https://publisher.example/path/" }
  ]
);

function issueCodes(rows: ValidationIssue[]) {
  return rows.map((issue) => issue.code);
}

console.log("Structured data rule unit tests passed");
