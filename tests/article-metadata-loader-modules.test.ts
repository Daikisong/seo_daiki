import assert from "node:assert/strict";
import type { Article } from "../packages/types/src";
import {
  generateArticleMetadata,
  generateCountryRiskGuideMetadata,
  generateFixedLocaleGuideMetadata,
  metadataForRenderableArticle
} from "../apps/web/lib/content/article-metadata-loaders";
import { generateCountryRiskGuideMetadata as directGenerateCountryRiskGuideMetadata } from "../apps/web/lib/content/article-metadata-country-risk";
import { generateFixedLocaleGuideMetadata as directGenerateFixedLocaleGuideMetadata } from "../apps/web/lib/content/article-metadata-fixed-locale";
import { metadataForRenderableArticle as directMetadataForRenderableArticle } from "../apps/web/lib/content/article-metadata-renderer";
import { generateArticleMetadata as directGenerateArticleMetadata } from "../apps/web/lib/content/article-metadata-standard";

assert.equal(generateArticleMetadata, directGenerateArticleMetadata);
assert.equal(generateCountryRiskGuideMetadata, directGenerateCountryRiskGuideMetadata);
assert.equal(generateFixedLocaleGuideMetadata, directGenerateFixedLocaleGuideMetadata);
assert.equal(metadataForRenderableArticle, directMetadataForRenderableArticle);

const previousPreviewToken = process.env.PREVIEW_TOKEN;

void main();

async function main() {
  try {
    delete process.env.PREVIEW_TOKEN;
    assert.deepEqual(await metadataForRenderableArticle(articleFixture({ publishStatus: "draft" })), {});

    const publishedMetadata = await metadataForRenderableArticle(articleFixture({ indexStatus: "index" }));
    assert.equal((publishedMetadata.robots as { index?: boolean }).index, true);

    process.env.PREVIEW_TOKEN = "preview-secret";
    const previewMetadata = await metadataForRenderableArticle(
      articleFixture({ publishStatus: "draft" }),
      Promise.resolve({ previewToken: "preview-secret" })
    );
    assert.equal((previewMetadata.robots as { index?: boolean }).index, false);
  } finally {
    if (previousPreviewToken === undefined) {
      delete process.env.PREVIEW_TOKEN;
    } else {
      process.env.PREVIEW_TOKEN = previousPreviewToken;
    }
  }

  console.log("Article metadata loader module tests passed");
}

function articleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: "article-1",
    locale: "en",
    slug: "test-article",
    type: "guide",
    title: "Test Article",
    h1: "Test H1",
    metaDescription: "Test meta description.",
    summary: "Test summary.",
    contentMdx: "Test body.",
    sections: [{ heading: "Evidence", body: "Evidence body." }],
    qualityScore: 85,
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
