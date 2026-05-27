import type { Article } from "@global-import-lab/types";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd,
  canonicalForArticle,
  sectionHrefForArticle
} from "@global-import-lab/seo";
import {
  validateArticleSchema,
  validateBreadcrumbSchema,
  validateCollectionSchema,
  validateDatasetSchema,
  validateProductReviewSchema
} from "./structuredDataSchemaValidators";
import {
  internalLinkSchemaItems,
  validateItemListSchema
} from "./structuredDataRules";
import type { QualityGateInput, ValidationIssue } from "./types";

export function validateStructuredData(input: QualityGateInput): ValidationIssue[] {
  const { article, product } = input;
  const issues: ValidationIssue[] = [];
  const canonical = canonicalForArticle(article);
  const articleJsonLd = buildArticleJsonLd(article);

  validateArticleSchema(issues, articleJsonLd, canonical);

  validateBreadcrumbSchema(issues, breadcrumbJsonLd(article, canonical), canonical);

  if (article.type === "review") {
    if (!product) {
      issues.push({
        code: "schema_review_product_missing",
        message: "Review pages must have product data so Product and Review JSON-LD can be generated.",
        severity: "blocker"
      });
    } else {
      validateProductReviewSchema(issues, buildProductJsonLd(product, article), canonical);
    }
  }

  if (article.type === "data") {
    validateDatasetSchema(issues, buildDatasetJsonLd(article), canonical);
  }

  if (article.type === "hub") {
    validateCollectionSchema(
      issues,
      buildCollectionPageJsonLd(article, internalLinkSchemaItems(article)),
      canonical,
      article.internalLinks.length
    );
  }

  if (article.type === "compare") {
    const itemList = buildItemListJsonLd(article.title, internalLinkSchemaItems(article));
    validateItemListSchema(issues, itemList, "schema_compare_item_list_invalid", article.internalLinks.length);
  }

  return issues;
}

function breadcrumbJsonLd(article: Article, canonical: string) {
  return buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl(`/${article.locale}/`) },
    { name: article.type, url: absoluteUrl(sectionHrefForArticle(article)) },
    { name: article.h1, url: canonical }
  ]);
}
