import type { Article } from "@global-import-lab/types";

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

export function sharedCommerceTerm(articleTextValue: string, linkText: string) {
  const articleTerms = new Set((articleTextValue.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((term) => term.length > 3));
  const linkTerms = (linkText.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((term) => term.length > 3);
  return linkTerms.some((term) => articleTerms.has(term));
}
