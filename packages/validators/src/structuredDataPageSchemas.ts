import {
  requireSchemaType,
  requireTextField,
  requireUrlField,
  validateItemListSchema
} from "./structuredDataRules";
import type { ValidationIssue } from "./types";
import { recordField } from "./validationUtils";

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
