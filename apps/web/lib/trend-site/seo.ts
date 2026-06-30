import type { Article } from "./types";
import { absoluteUrl, articlePath } from "./routes";
import { hreflangForLocale, isIndexableLocale } from "./locales";

export function articleRobots(article: Article) {
  if (article.indexStatus === "index" && isIndexableLocale(article.locale)) {
    return undefined;
  }

  return {
    index: false,
    follow: true,
  };
}

export function articleLanguageAlternates(
  article: Article,
  indexedArticles: Article[],
  siteUrl?: string,
) {
  if (!article.localization?.clusterId) {
    return undefined;
  }

  // Hreflang is intentionally opt-in. Trend pages from different countries
  // should not be clustered just because they share a category or product type.
  const variants = indexedArticles
    .filter(
      (candidate) =>
        candidate.localization?.clusterId === article.localization?.clusterId,
    )
    .filter(
      (candidate) =>
        candidate.indexStatus === "index" &&
        candidate.publishStatus === "published",
    )
    .filter((candidate) => isIndexableLocale(candidate.locale));

  if (variants.length < 2) {
    return undefined;
  }

  const languages = Object.fromEntries(
    variants.map((variant) => [
      hreflangForLocale(variant.locale),
      absoluteUrl(articlePath(variant), siteUrl),
    ]),
  );
  const xDefault =
    variants.find((variant) => variant.localization?.xDefault) ??
    variants.find((variant) => variant.locale === "en");

  return xDefault
    ? { ...languages, "x-default": absoluteUrl(articlePath(xDefault), siteUrl) }
    : languages;
}

export function validateLocalizationClusters(articles: Article[]) {
  const groups = new Map<string, Article[]>();

  for (const article of articles) {
    if (!article.localization?.clusterId) {
      continue;
    }
    const group = groups.get(article.localization.clusterId) ?? [];
    group.push(article);
    groups.set(article.localization.clusterId, group);
  }

  for (const [clusterId, variants] of groups.entries()) {
    if (variants.length < 2) {
      throw new Error(
        `${clusterId} hreflang cluster needs at least two complete localized variants.`,
      );
    }

    for (const variant of variants) {
      if (
        variant.indexStatus !== "index" ||
        variant.publishStatus !== "published"
      ) {
        throw new Error(
          `${variant.id} cannot be inside a hreflang cluster until it is published and indexable.`,
        );
      }
      if (!isIndexableLocale(variant.locale)) {
        throw new Error(
          `${variant.id} uses planned locale ${variant.locale}; open the locale before clustering.`,
        );
      }
    }
  }
}
