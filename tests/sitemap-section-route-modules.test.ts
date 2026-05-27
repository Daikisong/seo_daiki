import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import {
  articlesForSitemapSection,
  isSitemapIndexSection,
  parseSitemapSection,
  sitemapSectionsForArticles
} from "../apps/web/lib/seo/sitemap-section-model";
import {
  emptySitemap,
  escapeXml,
  sitemapIndexXml,
  sitemapUrlsetXml
} from "../apps/web/lib/seo/sitemap-section-xml";

const guideArticle = articleFixture({ id: "guide-1", locale: "pt-br", slug: "carregadores", type: "guide" });
const draftArticle = articleFixture({
  id: "guide-2",
  locale: "pt-br",
  slug: "draft",
  type: "guide",
  indexStatus: "noindex"
});

assert.equal(isSitemapIndexSection("index.xml"), true);
assert.equal(isSitemapIndexSection("pt-br-guides.xml"), false);
assert.deepEqual(parseSitemapSection("pt-br-guides.xml"), { locale: "pt-br", bucket: "guides" });
assert.equal(parseSitemapSection("unknown-guides.xml"), null);

assert.deepEqual(articlesForSitemapSection([guideArticle, draftArticle], "pt-br", "guides"), [guideArticle]);
assert.deepEqual(sitemapSectionsForArticles([guideArticle, draftArticle]), ["pt-br-guides"]);

assert.equal(escapeXml("https://example.com/a?x=1&y=\"two\""), "https://example.com/a?x=1&amp;y=&quot;two&quot;");
assert.match(sitemapIndexXml(["pt-br-guides"], "https://site.test"), /https:\/\/site\.test\/sitemaps\/pt-br-guides\.xml/);
assert.match(sitemapUrlsetXml([guideArticle], "https://site.test"), /https:\/\/site\.test\/pt-br\/guias\/carregadores\//);
assert.match(emptySitemap(), /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);

console.log("Sitemap section route module tests passed");

function articleFixture(overrides: Partial<Article>): Article {
  return {
    id: "article-1",
    locale: "en",
    slug: "sample",
    type: "guide",
    title: "Sample guide",
    h1: "Sample guide",
    metaDescription: "Sample guide description.",
    summary: "Sample summary.",
    contentMdx: "Sample body.",
    sections: [],
    qualityScore: 90,
    indexStatus: "index",
    publishStatus: "published",
    hreflangMap: {},
    internalLinks: [],
    affiliateLinks: [],
    evidenceIds: [],
    lastUpdated: "2026-05-27",
    ...overrides
  };
}
