import type { Article } from "@global-import-lab/types";
import { articlePath, canonicalForArticle, hreflangKeyForArticle } from "@global-import-lab/seo";
import type { ValidationIssue } from "./types";
import { normalizeUrl } from "./validationUtils";

export function validateSeoIntegrity(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const expectedCanonical = canonicalForArticle(article);
  const expectedPath = articlePath(article);
  const ownHref = article.hreflangMap[hreflangKeyForArticle(article)] ?? article.hreflangMap[article.locale];

  if (article.canonicalUrl && normalizeUrl(article.canonicalUrl) !== normalizeUrl(expectedCanonical)) {
    issues.push({
      code: "canonical_mismatch",
      message: `Stored canonical ${article.canonicalUrl} should match generated canonical ${expectedCanonical}.`,
      severity: "blocker"
    });
  }

  if (ownHref && normalizeUrl(ownHref) !== normalizeUrl(expectedCanonical)) {
    issues.push({
      code: "hreflang_self_mismatch",
      message: `Self hreflang ${ownHref} should match the page canonical ${expectedCanonical}.`,
      severity: "blocker"
    });
  }

  if (!expectedPath.endsWith(`/${article.slug}/`)) {
    issues.push({
      code: "slug_path_mismatch",
      message: `Article slug ${article.slug} is not the final path segment in ${expectedPath}.`,
      severity: "blocker"
    });
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    issues.push({
      code: "slug_format_invalid",
      message: `Slug should be lowercase ASCII words separated by hyphens: ${article.slug}.`,
      severity: "blocker"
    });
  }

  if (article.title.length < 35 || article.title.length > 80) {
    issues.push({
      code: "title_length_outside_seo_range",
      message: `Title length should stay between 35 and 80 characters; found ${article.title.length}.`,
      severity: "warning"
    });
  }

  if (article.metaDescription.length < 90 || article.metaDescription.length > 170) {
    issues.push({
      code: "meta_description_length_outside_seo_range",
      message: `Meta description length should stay between 90 and 170 characters; found ${article.metaDescription.length}.`,
      severity: "warning"
    });
  }

  if (/^best\b.+\b20\d{2}\b/i.test(article.title)) {
    issues.push({
      code: "generic_best_year_title",
      message: "Title should not use generic 'Best ... 20xx' phrasing without evidence-first specificity.",
      severity: "blocker"
    });
  }

  for (const [hreflang, href] of Object.entries(article.hreflangMap)) {
    if (!href) {
      continue;
    }
    if (!/^https?:\/\//i.test(href)) {
      issues.push({
        code: "hreflang_not_absolute",
        message: `Hreflang ${hreflang} must use an absolute URL: ${href}.`,
        severity: "blocker"
      });
    }
  }

  return issues;
}
