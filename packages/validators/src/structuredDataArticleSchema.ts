import {
  requireSchemaType,
  requireTextField,
  requireUrlField
} from "./structuredDataRules";
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
