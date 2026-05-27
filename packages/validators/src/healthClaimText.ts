import type { Article } from "@global-import-lab/types";

export function articleHealthClaimText(article: Article) {
  return [
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
}

export function articleLooksHealthRelated(article: Article, fullText = articleHealthClaimText(article)) {
  const healthSensitivity = article.healthSensitivity ?? "none";
  return (
    healthSensitivity !== "none" ||
    /\b(iherb|supplement|magnesium|probiotic|vitamin|dosage|dose|gut health|sleep|pregnancy|medication|chronic|ingredient|wellness|nutrition)\b/i.test(
      fullText
    )
  );
}

export function healthDisclaimerPresent(fullText: string) {
  return (
    /\bnot medical advice\b/i.test(fullText) &&
    /\bconsult (a|your) (qualified )?(doctor|physician|healthcare professional|professional)\b/i.test(fullText)
  );
}

export function hasQualifiedHealthEvidence(article: Article, fullText: string) {
  return (
    article.complianceStatus === "passed" &&
    article.evidenceIds.length > 0 &&
    /\b(source|evidence|label direction|manufacturer label|manual approval)\b/i.test(fullText)
  );
}

export function hasSupplementOffer(article: Article) {
  return article.affiliateLinks.some((link) => /iherb|supplement|vitamin|magnesium|probiotic/i.test(`${link.label} ${link.href}`));
}
