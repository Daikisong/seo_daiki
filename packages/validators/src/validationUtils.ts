import type { Article } from "@global-import-lab/types";

export function normalizeUrl(value: string) {
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

export function articleText(article: Article) {
  return [
    article.title,
    article.h1,
    article.metaDescription,
    article.summary,
    article.contentMdx,
    article.evidenceIds.join(" "),
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.internalLinks.flatMap((link) => [link.label, link.href]),
    ...article.affiliateLinks.flatMap((link) => [link.label, link.href, link.merchantSlug ?? ""])
  ].join(" ");
}

export function hostForUrl(value: string) {
  try {
    return new URL(value, "https://example.com").hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

export function hostMatchesDomain(host: string, domain: string) {
  const normalized = domain
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^\*\./, "")
    .toLowerCase();

  return host === normalized || host.endsWith(`.${normalized}`);
}

export function numericJsonField(value: unknown, field: string) {
  if (!isRecord(value)) {
    return undefined;
  }
  const raw = value[field];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : undefined;
}

export function stringJsonField(value: unknown, field: string) {
  if (!isRecord(value)) {
    return undefined;
  }
  const raw = value[field];
  return typeof raw === "string" ? raw : undefined;
}

export function booleanJsonField(value: unknown, field: string) {
  if (!isRecord(value)) {
    return false;
  }
  return value[field] === true;
}

export function sharedCommerceTerm(articleTextValue: string, linkText: string) {
  const articleTerms = new Set((articleTextValue.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((term) => term.length > 3));
  const linkTerms = (linkText.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((term) => term.length > 3);
  return linkTerms.some((term) => articleTerms.has(term));
}

export function stringField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return typeof value === "string" ? value : undefined;
}

export function recordField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return isRecord(value) ? value : undefined;
}

export function arrayField(schema: Record<string, unknown>, field: string) {
  const value = schema[field];
  return Array.isArray(value) ? value : [];
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
