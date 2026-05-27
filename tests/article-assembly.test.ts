import assert from "node:assert/strict";
import type { ArticleType, Locale } from "@global-import-lab/types";
import {
  buildArticleFromDraft,
  buildArticleHreflangMap,
  buildArticlesFromDrafts,
  buildArticleTranslationGroups,
  fixtureSlug
} from "../packages/content/src/article-assembly";
import type { ArticleDraft } from "../packages/content/src/article-draft-types";

function draft(overrides: Partial<ArticleDraft>): ArticleDraft {
  const locale = overrides.locale ?? "en";
  const type = overrides.type ?? "guide";
  const slug = overrides.slug ?? "shared-guide";
  const title = overrides.title ?? "USB-C shared guide";
  return {
    group: "shared-topic",
    id: "art-en-shared-guide",
    locale,
    slug,
    type,
    title,
    h1: title,
    metaDescription: "USB-C variant plug cable evidence price risk guide.",
    summary: "USB-C variant plug cable evidence price risk guide.",
    contentMdx: "usb-c variant plug cable evidence price risk guide",
    sections: [{ heading: "Evidence", body: "USB-C variant plug cable evidence price risk." }],
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    internalLinks: [{ label: "Old manual link", href: "/old/", reason: "guide" }],
    affiliateLinks: [],
    evidenceIds: ["ev-output", "ev-risk"],
    lastUpdated: "2030-03-04",
    ...overrides
  };
}

const enGuide = draft({});
const esGuide = draft({
  id: "art-es-shared-guide",
  locale: "es",
  slug: "guia-compartida",
  title: "Guía compartida USB-C",
  indexStatus: "pending",
  publishStatus: "draft"
});
const enData = draft({
  group: "supporting-data",
  id: "art-en-data",
  slug: "supporting-data",
  type: "data",
  title: "USB-C supporting data",
  contentMdx: "usb-c evidence data output price risk"
});
const fallbackEs = draft({
  group: "fallback-source",
  id: "art-es-fallback",
  locale: "es",
  slug: "fuente-es",
  type: "trend",
  title: "Tendencia fuente ES"
});
const fallbackPt = draft({
  group: "fallback-source",
  id: "art-pt-fallback",
  locale: "pt-br",
  slug: "fonte-pt",
  type: "trend",
  title: "Tendência fonte PT"
});

const drafts = [enGuide, esGuide, enData, fallbackEs, fallbackPt];

assert.equal(fixtureSlug("Buyer Guide: Travel GaN!"), "buyer-guide-travel-gan");

const groups = buildArticleTranslationGroups(drafts);
assert.equal(groups.length, 2);

const sharedGroup = groups.find((group) => group.id === "tg-shared-topic");
assert.ok(sharedGroup);
assert.equal(sharedGroup.sourceArticleId, "art-en-shared-guide");
assert.deepEqual(sharedGroup.variants.map((variant) => variant.id), ["tv-art-en-shared-guide", "tv-art-es-shared-guide"]);
assert.equal(sharedGroup.variants[0]?.sourceLocale, undefined);
assert.equal(sharedGroup.variants[0]?.localizationDepthScore, 100);
assert.equal(sharedGroup.variants[0]?.status, "published");
assert.equal(sharedGroup.variants[1]?.sourceLocale, "en");
assert.equal(sharedGroup.variants[1]?.localizationDepthScore, 55);
assert.equal(sharedGroup.variants[1]?.status, "draft");

const fallbackGroup = groups.find((group) => group.id === "tg-fallback-source");
assert.ok(fallbackGroup);
assert.equal(fallbackGroup.sourceArticleId, "art-es-fallback");
assert.equal(fallbackGroup.variants.find((variant) => variant.articleId === "art-pt-fallback")?.sourceLocale, "es");

const hreflangMap = buildArticleHreflangMap(enGuide, drafts, "https://example.test", "/global/");
assert.equal(hreflangMap.en, "https://example.test/en/guides/shared-guide/");
assert.equal(hreflangMap.es, "https://example.test/es/guias/guia-compartida/");
assert.equal(hreflangMap["pt-BR"], undefined);
assert.equal(hreflangMap["x-default"], "https://example.test/global/");

const article = buildArticleFromDraft(enGuide, drafts, { products: [], siteUrl: "https://example.test", xDefaultPath: "/global/" });
assert.equal(article.canonicalUrl, "https://example.test/en/guides/shared-guide/");
assert.equal(article.hreflangMap.en, "https://example.test/en/guides/shared-guide/");
assert.equal(article.hreflangMap.es, "https://example.test/es/guias/guia-compartida/");
assert.equal(article.hreflangMap["x-default"], "https://example.test/global/");
assert.notEqual(article.internalLinks[0]?.href, "/old/");
assert.ok(article.internalLinks.some((link) => link.href === "/en/data/supporting-data/" && link.reason === "data"));

const articles = buildArticlesFromDrafts(drafts, { products: [], siteUrl: "https://example.test" });
assert.equal(articles.length, drafts.length);
assert.equal(articles.find((item) => item.id === "art-es-shared-guide")?.canonicalUrl, "https://example.test/es/guias/guia-compartida/");
assert.equal(articles.find((item) => item.id === "art-pt-fallback")?.hreflangMap["pt-BR"], "https://example.test/pt-br/tendencias/fonte-pt/");

const realArticleType: ArticleType = article.type;
const realLocale: Locale = article.locale;
assert.equal(realArticleType, "guide");
assert.equal(realLocale, "en");

console.log("Article assembly unit tests passed");
