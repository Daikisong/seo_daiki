import type { Article, EvidencePack, IndexStatus, Product } from "@global-import-lab/types";
import {
  absoluteUrl,
  articlePath,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd,
  canonicalForArticle,
  hreflangKeyForArticle,
  sectionHrefForArticle
} from "@global-import-lab/seo";

export interface ValidationIssue {
  code: string;
  message: string;
  severity: "blocker" | "warning";
}

export interface QualityGateResult {
  score: number;
  indexStatus: IndexStatus;
  issues: ValidationIssue[];
  breakdown: Record<string, number>;
}

export interface QualityGateInput {
  article: Article;
  product?: Product;
  evidencePack?: EvidencePack;
}

export function validateAffiliateLinks(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (article.type === "review" && article.affiliateLinks.length === 0) {
    issues.push({
      code: "affiliate_missing",
      message: "Review pages must include an affiliate disclosure and at least one tracked affiliate link.",
      severity: "blocker"
    });
  }

  for (const link of article.affiliateLinks) {
    const relTokens = new Set(link.rel.split(/\s+/).filter(Boolean));
    if (!relTokens.has("sponsored") || !relTokens.has("nofollow")) {
      issues.push({
        code: "affiliate_rel_invalid",
        message: `Affiliate link "${link.label}" must render rel="sponsored nofollow".`,
        severity: "blocker"
      });
    }
  }

  return issues;
}

export function validateInternalLinks(article: Article): ValidationIssue[] {
  if (article.internalLinks.length >= 5) {
    return [];
  }

  return [
    {
      code: "internal_links_low",
      message: `Article has ${article.internalLinks.length} internal links; indexable pages need at least 5.`,
      severity: "blocker"
    }
  ];
}

export function validateHreflang(article: Article): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ownHref = article.hreflangMap[hreflangKeyForArticle(article)] ?? article.hreflangMap[article.locale];
  if (!ownHref) {
    issues.push({
      code: "hreflang_self_missing",
      message: "Localized pages must include a self hreflang alternate.",
      severity: "blocker"
    });
  }

  if (!article.hreflangMap["x-default"]) {
    issues.push({
      code: "hreflang_default_missing",
      message: "Localized pages must include an x-default alternate.",
      severity: "warning"
    });
  }

  return issues;
}

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

export function validateStructuredData(input: QualityGateInput): ValidationIssue[] {
  const { article, product } = input;
  const issues: ValidationIssue[] = [];
  const canonical = canonicalForArticle(article);
  const articleJsonLd = buildArticleJsonLd(article);

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

  validateBreadcrumbSchema(issues, article, canonical);

  if (article.type === "review") {
    if (!product) {
      issues.push({
        code: "schema_review_product_missing",
        message: "Review pages must have product data so Product and Review JSON-LD can be generated.",
        severity: "blocker"
      });
    } else {
      validateProductReviewSchema(issues, product, article, canonical);
    }
  }

  if (article.type === "data") {
    validateDatasetSchema(issues, article, canonical);
  }

  if (article.type === "hub") {
    validateCollectionSchema(issues, article, canonical);
  }

  if (article.type === "compare") {
    const itemList = buildItemListJsonLd(article.title, internalLinkSchemaItems(article));
    validateItemListSchema(issues, itemList, "schema_compare_item_list_invalid", article.internalLinks.length);
  }

  return issues;
}

export function validateClaimEvidence(input: QualityGateInput): ValidationIssue[] {
  const { article, evidencePack, product } = input;
  const evidenceIds = new Set(article.evidenceIds);
  const backedSections = article.sections.filter((section) => section.evidenceIds?.some((id) => evidenceIds.has(id)));
  const verifiedClaimCount = product?.verifiedClaims.length ?? evidencePack?.packJson.verifiedClaims.length ?? 0;
  const sellerClaimCount = product?.sellerClaims.length ?? evidencePack?.packJson.sellerClaims.length ?? 0;
  const attachedEvidenceCount = verifiedClaimCount + sellerClaimCount || article.evidenceIds.length;
  const issues: ValidationIssue[] = [];

  if (backedSections.length < 3 || attachedEvidenceCount < 3) {
    issues.push({
      code: "evidence_claims_low",
      message: "Indexable articles need at least 3 evidence-backed claims.",
      severity: "blocker"
    });
  }

  const fullText = [article.title, article.summary, ...article.sections.map((section) => section.body)].join(" ");
  const unsupportedTestPhrase = /\b(we tested|our test|lab measured|verified by test)\b/i.test(fullText);
  if (unsupportedTestPhrase && verifiedClaimCount === 0) {
    issues.push({
      code: "test_claim_without_verified_evidence",
      message: "The article uses direct-test language but no verified claims are attached.",
      severity: "blocker"
    });
  }

  return issues;
}

export function validateThinAffiliate(input: QualityGateInput): ValidationIssue[] {
  const { article, product } = input;
  const uniqueSignals =
    article.sections.filter((section) =>
      /variant|risk|evidence|price|verified|tested|customs|plug|return|alternative/i.test(
        `${section.heading} ${section.body}`
      )
    ).length + (product?.marketRisks.length ?? 0);

  if (uniqueSignals < 4) {
    return [
      {
        code: "thin_affiliate_risk",
        message: "The article does not yet show enough information beyond seller descriptions.",
        severity: "blocker"
      }
    ];
  }

  return [];
}

export function validateHealthClaimGuard(article: Article): ValidationIssue[] {
  const fullText = [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.affiliateLinks.flatMap((link) => [link.label, link.href])
  ]
    .join(" ")
    .toLowerCase();
  const healthSensitivity = article.healthSensitivity ?? "none";
  const looksHealthRelated =
    healthSensitivity !== "none" ||
    /\b(iherb|supplement|magnesium|probiotic|vitamin|dosage|dose|gut health|sleep|pregnancy|medication|chronic|ingredient|wellness|nutrition)\b/i.test(
      fullText
    );

  if (!looksHealthRelated) {
    return [];
  }

  const issues: ValidationIssue[] = [];
  const disclaimerPresent =
    /\bnot medical advice\b/i.test(fullText) &&
    /\bconsult (a|your) (qualified )?(doctor|physician|healthcare professional|professional)\b/i.test(fullText);
  const hasQualifiedHealthEvidence =
    article.complianceStatus === "passed" &&
    article.evidenceIds.length > 0 &&
    /\b(source|evidence|label direction|manufacturer label|manual approval)\b/i.test(fullText);
  const forbiddenClaims: Array<{ pattern: RegExp; code: string; message: string }> = [
    {
      pattern: /\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing)\b/i,
      code: "health_claim_disease_language",
      message: "Health content cannot use cure, treatment, or prevention language without qualified evidence and manual approval."
    },
    {
      pattern: /\bguaranteed\b/i,
      code: "health_claim_guarantee",
      message: "Health content cannot use guaranteed outcome language."
    },
    {
      pattern: /\bdoctor recommended\b/i,
      code: "health_claim_doctor_recommended",
      message: "Doctor-recommended claims need qualified source evidence and manual approval."
    },
    {
      pattern: /\bclinically proven\b/i,
      code: "health_claim_clinically_proven",
      message: "Clinically-proven claims need qualified clinical source evidence."
    },
    {
      pattern: /\breplace (your )?(medicine|medication|treatment|doctor)\b/i,
      code: "health_claim_medical_replacement",
      message: "Health content cannot recommend replacing medical treatment or a professional consultation."
    },
    {
      pattern: /\b(before and after|transformation|transform your body|rapid results)\b/i,
      code: "health_claim_transformation",
      message: "Unsupported before/after or transformation claims are blocked for health content."
    },
    {
      pattern: /\b(you should take|you need to take|safe for everyone|stop taking medication)\b/i,
      code: "health_claim_medical_advice",
      message: "Medical advice language is blocked for supplement content."
    }
  ];

  for (const claim of forbiddenClaims) {
    if (claim.pattern.test(fullText) && !hasQualifiedHealthEvidence) {
      issues.push({
        code: claim.code,
        message: claim.message,
        severity: "blocker"
      });
    }
  }

  if (/\b(dosage|dose|take \d+|\d+\s?(mg|mcg|g|iu)\b|mg per day|capsules per day)\b/i.test(fullText) && !hasQualifiedHealthEvidence) {
    issues.push({
      code: "health_dosage_without_source",
      message: "Supplement dosage advice needs qualified source evidence or label-direction context.",
      severity: "blocker"
    });
  }

  const hasSupplementOffer = article.affiliateLinks.some((link) => /iherb|supplement|vitamin|magnesium|probiotic/i.test(`${link.label} ${link.href}`));
  if (!disclaimerPresent && (hasSupplementOffer || healthSensitivity !== "none")) {
    issues.push({
      code: "health_disclaimer_missing",
      message: "Health or iHerb supplement pages need a visible informational-only disclaimer and professional-consultation warning.",
      severity: "blocker"
    });
  }

  if (/\b(pregnancy|pregnant|medication|children|child|chronic illness|chronic condition)\b/i.test(fullText) && !/\bconsult\b/i.test(fullText)) {
    issues.push({
      code: "health_sensitive_warning_missing",
      message: "Health content mentioning pregnancy, medication, children, or chronic illness needs a consult-professional warning.",
      severity: "blocker"
    });
  }

  if (healthSensitivity === "high" && article.indexStatus === "index" && article.complianceStatus !== "passed") {
    issues.push({
      code: "health_high_sensitivity_manual_approval_required",
      message: "High-sensitivity health articles require manual compliance approval before indexing.",
      severity: "blocker"
    });
  }

  if (/^best\b.+\b(supplement|vitamin|magnesium|probiotic)/i.test(article.title)) {
    issues.push({
      code: "health_generic_best_supplement_title",
      message: "Generic best-supplement titles need stronger sourcing and specificity.",
      severity: "warning"
    });
  }

  return issues;
}

export function runQualityGate(input: QualityGateInput): QualityGateResult {
  const { article, product, evidencePack } = input;
  const claimEvidenceIssues = validateClaimEvidence(input);
  const thinAffiliateIssues = validateThinAffiliate(input);
  const internalLinkIssues = validateInternalLinks(article);
  const hreflangIssues = validateHreflang(article);
  const seoIntegrityIssues = validateSeoIntegrity(article);
  const structuredDataIssues = validateStructuredData(input);
  const affiliateIssues = validateAffiliateLinks(article);
  const healthIssues = validateHealthClaimGuard(article);
  const issues = [
    ...claimEvidenceIssues,
    ...thinAffiliateIssues,
    ...internalLinkIssues,
    ...hreflangIssues,
    ...seoIntegrityIssues,
    ...structuredDataIssues,
    ...affiliateIssues,
    ...healthIssues
  ];

  const hasEvidencePack = Boolean(evidencePack) || article.evidenceIds.length >= 3;
  const hasLocaleRisk =
    product?.marketRisks.some((risk) => risk.locale === article.locale) ??
    /country|customs|risk|local|brasil|españa|spain|brazil/i.test(article.contentMdx);

  const breakdown = {
    searchIntent: article.summary.length > 80 ? 10 : 5,
    uniqueInfo: thinAffiliateIssues.length === 0 ? 20 : 8,
    evidencePack: hasEvidencePack ? 15 : 0,
    verifiedData:
      (product?.verifiedClaims.length ?? evidencePack?.packJson.verifiedClaims.length ?? article.evidenceIds.length) > 0
        ? 20
        : 8,
    variantTraps: /variant|option|plug|cable/i.test(article.contentMdx) ? 10 : 3,
    localeRisk: hasLocaleRisk ? 10 : 4,
    internalLinks: article.internalLinks.length >= 5 ? 5 : 0,
    seoIntegrity:
      hreflangIssues.length === 0 && seoIntegrityIssues.length === 0 && structuredDataIssues.length === 0 ? 5 : 2,
    affiliateIntegrity: affiliateIssues.length === 0 && healthIssues.length === 0 ? 5 : 0
  };

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const hasBlocker = issues.some((issue) => issue.severity === "blocker");
  const indexStatus: IndexStatus = hasBlocker ? "noindex" : score >= 80 ? "index" : score >= 65 ? "pending" : "noindex";

  return { score, indexStatus, issues, breakdown };
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    return url.toString();
  } catch {
    return value.endsWith("/") ? value : `${value}/`;
  }
}

function validateBreadcrumbSchema(issues: ValidationIssue[], article: Article, canonical: string) {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl(`/${article.locale}/`) },
    { name: article.type, url: absoluteUrl(sectionHrefForArticle(article)) },
    { name: article.h1, url: canonical }
  ]);

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

function validateProductReviewSchema(
  issues: ValidationIssue[],
  product: Product,
  article: Article,
  canonical: string
) {
  const productJsonLd = buildProductJsonLd(product, article);

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

function validateDatasetSchema(issues: ValidationIssue[], article: Article, canonical: string) {
  const dataset = buildDatasetJsonLd(article);

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

function validateCollectionSchema(issues: ValidationIssue[], article: Article, canonical: string) {
  const collection = buildCollectionPageJsonLd(article, internalLinkSchemaItems(article));

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

  validateItemListSchema(issues, mainEntity, "schema_collection_item_list_invalid", article.internalLinks.length);
}

function validateItemListSchema(
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

function internalLinkSchemaItems(article: Article) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}

function requireSchemaType(
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

function requireTextField(
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

function requireUrlField(
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

function stringField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return typeof value === "string" ? value : undefined;
}

function recordField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return isRecord(value) ? value : undefined;
}

function arrayField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
