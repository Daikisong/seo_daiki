import assert from "node:assert/strict";
import test from "node:test";

import {
  trendCategories,
  trendCategoryForArticle,
  visibleTrendArticles,
  visibleTrendCategories,
} from "./categories";
import { getIndexedArticles, getStaticTrendParams } from "./data";
import {
  defaultLocale,
  hreflangForLocale,
  indexableLocaleCodes,
  isIndexableLocale,
  targetLocaleConfigs,
} from "./locales";
import { articleLanguageAlternates, validateLocalizationClusters } from "./seo";

const EXPECTED_LOCALES = [
  "en",
  "en-us",
  "en-gb",
  "de-de",
  "fr-fr",
  "it-it",
  "es-es",
  "ko-kr",
  "ja-jp",
  "zh-tw",
  "zh-hk",
  "pt-br",
  "nl-nl",
  "pl-pl",
  "sv-se",
  "tr-tr",
  "th-th",
  "vi-vn",
] as const;

test("central locale config defines the planned 18-locale model without invalid hreflang codes", () => {
  assert.deepEqual(
    targetLocaleConfigs.map((config) => config.code),
    [...EXPECTED_LOCALES],
  );
  assert.equal(targetLocaleConfigs.length, 18);
  assert.equal(defaultLocale, "en");

  for (const config of targetLocaleConfigs) {
    assert.match(config.code, /^en$|^[a-z]{2}-[a-z]{2}$/);
    assert.notEqual(config.code, "en-eu");
    assert.notEqual(config.code, "en-uk");
    assert.notEqual(config.code, "eu");
    assert.notEqual(config.code, "uk");
    assert.equal(hreflangForLocale(config.code), config.code);
  }
});

test("only opened locales can enter public article indexes and static trend params", () => {
  assert.deepEqual(indexableLocaleCodes(), ["en"]);
  assert.equal(isIndexableLocale("en"), true);
  for (const locale of EXPECTED_LOCALES.filter((locale) => locale !== "en")) {
    assert.equal(
      isIndexableLocale(locale),
      false,
      `${locale} should stay planned until real localized content is ready`,
    );
  }

  const indexedArticles = getIndexedArticles();
  assert.ok(indexedArticles.length > 0);
  assert.equal(
    indexedArticles.every((article) => isIndexableLocale(article.locale)),
    true,
  );
  assert.deepEqual(
    getStaticTrendParams().map((params) => params.locale),
    indexedArticles.map((article) => article.locale),
  );
});

test("hreflang stays opt-in and never clusters articles only because they share a category", () => {
  const articles = getIndexedArticles();
  const article = articles[0];
  assert.ok(article);
  assert.equal(
    articleLanguageAlternates(article, articles, "https://trend-jacob.test"),
    undefined,
  );

  const singletonVariant = {
    ...article,
    localization: { clusterId: "singleton-cluster" },
  };
  assert.throws(
    () => validateLocalizationClusters([singletonVariant]),
    /needs at least two complete localized variants/,
  );
});

test("public category surface exposes only categories intentionally opened in navigation and sitemap", () => {
  const visibleSlugs = new Set<string>(
    visibleTrendCategories.map((category) => category.slug),
  );
  assert.ok(visibleSlugs.size > 0);
  for (const category of trendCategories) {
    assert.equal(visibleSlugs.has(category.slug), Boolean(category.isPublic));
  }
});

test("explicit category articles stay attached to their intended public category", () => {
  const article = getIndexedArticles()[0];
  assert.ok(article);

  const categoryArticle = {
    ...article,
    id: "future-garden-article",
    slug: "future-garden-article",
    categorySlug: "garden-trends",
  };

  assert.equal(trendCategoryForArticle(categoryArticle).slug, "garden-trends");
  assert.deepEqual(visibleTrendArticles([categoryArticle]), [categoryArticle]);
});
