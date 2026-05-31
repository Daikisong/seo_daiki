import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import {
  buildSitemapEntries,
  shouldIncludeInSitemap,
  sitemapChangeFrequency,
  sitemapPriority
} from "@global-import-lab/seo";
import {
  shouldIncludeInSitemap as directShouldIncludeInSitemap,
  sitemapChangeFrequency as directSitemapChangeFrequency,
  sitemapPriority as directSitemapPriority
} from "../packages/seo/src/sitemap-policy";

assert.equal(shouldIncludeInSitemap, directShouldIncludeInSitemap);
assert.equal(sitemapChangeFrequency, directSitemapChangeFrequency);
assert.equal(sitemapPriority, directSitemapPriority);

const guide = articleFixture({ slug: "charger-guide", type: "guide" });
const draft = articleFixture({ slug: "draft-guide", type: "guide", publishStatus: "draft" });
const noindex = articleFixture({ slug: "noindex-guide", type: "guide", indexStatus: "noindex" });

assert.equal(shouldIncludeInSitemap(guide), true);
assert.equal(shouldIncludeInSitemap(draft), false);
assert.equal(shouldIncludeInSitemap(noindex), false);
assert.equal(sitemapChangeFrequency(articleFixture({ type: "trend" })), "weekly");
assert.equal(sitemapChangeFrequency(articleFixture({ type: "guide" })), "monthly");
assert.equal(sitemapPriority(articleFixture({ type: "hub" })), 0.9);
assert.equal(sitemapPriority(articleFixture({ type: "buyer_guide" })), 0.8);
assert.equal(sitemapPriority(articleFixture({ type: "ingredient_guide" })), 0.75);
assert.equal(sitemapPriority(articleFixture({ type: "methodology" })), 0.7);

assert.deepEqual(
  buildSitemapEntries([guide, draft, noindex]).map((entry) => entry.url),
  ["http://localhost:3000/en/guides/charger-guide/"]
);

console.log("SEO sitemap policy module tests passed");

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
