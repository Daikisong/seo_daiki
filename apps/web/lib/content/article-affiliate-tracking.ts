import type { Article } from "@global-import-lab/types";

type RuntimeEnv = Record<string, string | undefined>;

export function affiliateTrackingHrefForArticle(
  link: Article["affiliateLinks"][number],
  article: Article,
  env: RuntimeEnv = process.env
) {
  if (link.placementId && env.CONTENT_SOURCE === "database") {
    const params = new URLSearchParams({ placementId: link.placementId });
    return `/api/affiliate-click?${params.toString()}`;
  }

  if (!unsafeAffiliateTargetRedirectAllowed(env)) {
    return link.href;
  }

  const params = new URLSearchParams({
    target: link.href,
    articleId: article.id,
    locale: article.locale
  });

  if (article.productId) {
    params.set("productId", article.productId);
  }

  return `/api/affiliate-click?${params.toString()}`;
}

export function unsafeAffiliateTargetRedirectAllowed(env: RuntimeEnv = process.env) {
  return env.NODE_ENV !== "production" && env.ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT === "true";
}
