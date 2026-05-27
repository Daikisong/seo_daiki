import {
  absoluteUrl,
  articlePath,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildDatasetJsonLd,
  buildItemListJsonLd,
  buildProductJsonLd,
  buildProductSnippetJsonLd,
  sectionHrefForArticle
} from "@global-import-lab/seo";
import type { Article, Product } from "@global-import-lab/types";

type RuntimeEnv = Record<string, string | undefined>;

export function breadcrumbItemsForArticle(article: Article) {
  return [
    { label: "Home", href: `/${article.locale}/` },
    {
      label: article.type,
      href: article.type === "hub" ? articlePath(article) : sectionHrefForArticle(article)
    },
    { label: article.h1, href: articlePath(article) }
  ];
}

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

export function reviewPathForProduct(locale: Article["locale"], product: Product, allArticles: Article[]) {
  const review =
    allArticles.find(
      (candidate) =>
        candidate.locale === locale &&
        candidate.type === "review" &&
        candidate.productId === product.id &&
        candidate.publishStatus === "published" &&
        candidate.indexStatus === "index"
    ) ??
    allArticles.find(
      (candidate) =>
        candidate.locale === locale &&
        candidate.type === "review" &&
        candidate.productId === product.id &&
        candidate.publishStatus === "published"
    );

  return review ? articlePath(review) : undefined;
}

export function buildArticlePageJsonLd(article: Article, product: Product | undefined, allProducts: Product[], allArticles: Article[]) {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", url: absoluteUrl(`/${article.locale}/`) },
    { name: article.type, url: absoluteUrl(sectionHrefForArticle(article)) },
    { name: article.h1, url: absoluteUrl(articlePath(article)) }
  ]);
  const articleJsonLd = buildArticleJsonLd(article);

  if (article.type === "data") {
    return [articleJsonLd, buildDatasetJsonLd(article), breadcrumbs];
  }

  if (article.type === "review" && product) {
    return [articleJsonLd, buildProductJsonLd(product, article), breadcrumbs];
  }

  if (article.type === "hub" || article.type === "compare") {
    const linkedProducts = allProducts.flatMap((item) => {
      const reviewPath = reviewPathForProduct(article.locale, item, allArticles);
      return reviewPath ? [{ product: item, name: item.canonicalName, url: absoluteUrl(reviewPath) }] : [];
    });
    const itemListLinks = internalLinkSchemaItems(article);

    if (article.type === "hub") {
      return [
        articleJsonLd,
        buildCollectionPageJsonLd(article, itemListLinks),
        buildItemListJsonLd(article.title, itemListLinks),
        breadcrumbs
      ];
    }

    return [
      articleJsonLd,
      buildItemListJsonLd(article.title, itemListLinks),
      ...linkedProducts.slice(0, 10).map((item) => buildProductSnippetJsonLd(item.product, item.url)),
      breadcrumbs
    ];
  }

  return [articleJsonLd, breadcrumbs];
}

export function internalLinkSchemaItems(article: Article) {
  return article.internalLinks.map((link) => ({
    name: link.label,
    url: /^https?:\/\//i.test(link.href) ? link.href : absoluteUrl(link.href)
  }));
}
