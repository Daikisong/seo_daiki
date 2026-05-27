import type { AffiliateLink, Article } from "@global-import-lab/types";

export const defaultAliExpressAllowedDomains = [
  "aliexpress.com",
  "www.aliexpress.com",
  "s.click.aliexpress.com",
  "best.aliexpress.com"
];

export const defaultIherbAllowedDomains = ["iherb.com", "www.iherb.com"];

const iherbPattern = /iherb|supplement|vitamin|magnesium|probiotic/i;

type SeedArticle = Pick<Article, "affiliateLinks" | "id" | "indexStatus" | "productId" | "publishStatus" | "slug">;
type SeedAffiliateLink = Pick<AffiliateLink, "href" | "label">;

export function affiliateLinksWithPlacementIds(
  article: SeedArticle,
  env: NodeJS.ProcessEnv = process.env
): AffiliateLink[] {
  return article.affiliateLinks.map((link, index) => {
    const iherbLink = isIherbSeedAffiliateLink(link);
    return {
      ...link,
      placementId: link.placementId ?? affiliatePlacementId(article.id, index),
      placementStatus: isApprovedSeedArticle(article) ? "approved" : "draft",
      disclosureShown: true,
      offerStatus: "active",
      merchantSlug: iherbLink ? "iherb" : "aliexpress",
      merchantAllowedDomains: iherbLink
        ? domainListFromEnv("IHERB_ALLOWED_AFFILIATE_DOMAINS", defaultIherbAllowedDomains, env)
        : domainListFromEnv("ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS", defaultAliExpressAllowedDomains, env),
      offerHealthSensitive: iherbLink
    };
  });
}

export function isIherbSeedAffiliateLink(link: SeedAffiliateLink) {
  return iherbPattern.test(`${link.label} ${link.href}`);
}

export function isApprovedSeedArticle(article: Pick<Article, "indexStatus" | "publishStatus">) {
  return article.publishStatus === "published" && article.indexStatus === "index";
}

export function affiliatePlacementId(articleId: string, index: number) {
  return `placement-${articleId}-${index + 1}`;
}

export function affiliateOfferId(articleId: string, index: number) {
  return `offer-${articleId}-${index + 1}`;
}

export function aliexpressAffiliateUrl(article: Pick<Article, "productId" | "slug">, index: number) {
  const itemKey = encodeURIComponent(article.productId ?? `${article.slug}-${index + 1}`);
  return `https://www.aliexpress.com/item/${itemKey}.html`;
}

export function iherbAffiliateUrl(article: Pick<Article, "slug">, index: number) {
  const itemKey = encodeURIComponent(`${article.slug}-${index + 1}`);
  return `https://www.iherb.com/pr/${itemKey}`;
}

export function countryForLocale(locale: string) {
  if (locale === "pt-br") {
    return "BR";
  }
  if (locale === "es") {
    return "ES";
  }
  return "US";
}

export function domainListFromEnv(name: string, fallback: string[], env: NodeJS.ProcessEnv = process.env) {
  return (env[name]?.split(",").map((item) => item.trim()).filter(Boolean) ?? fallback).map((domain) =>
    domain.toLowerCase()
  );
}
