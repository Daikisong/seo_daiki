import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import {
  buildProgrammaticInternalLinks,
  dedupeInternalLinks,
  scoreInternalLink,
  type InternalLinkArticle
} from "../packages/content/src/internal-linking";
import { dedupeInternalLinks as directDedupeInternalLinks } from "../packages/content/src/internal-linking-link-model";
import {
  eligibleInternalLinkCandidates,
  scoredInternalLinkCandidates
} from "../packages/content/src/internal-linking-selection";
import { scoreInternalLink as directScoreInternalLink } from "../packages/content/src/internal-linking-rules";

assert.equal(dedupeInternalLinks, directDedupeInternalLinks);
assert.equal(scoreInternalLink, directScoreInternalLink);
assert.equal(typeof buildProgrammaticInternalLinks, "function");

const source = article({ id: "source", slug: "source", locale: "en" });
const published = article({ id: "published", slug: "published", locale: "en" });
const draft = article({ id: "draft", slug: "draft", locale: "en", publishStatus: "draft" });
const otherLocale = article({ id: "other", slug: "other", locale: "es" });
const products: Product[] = [];

assert.deepEqual(
  eligibleInternalLinkCandidates(source, [source, published, draft, otherLocale]).map((candidate) => candidate.id),
  ["published"]
);
assert.equal(scoredInternalLinkCandidates(source, [published], products).length, 1);

console.log("Internal linking module export tests passed");

function article(overrides: Partial<InternalLinkArticle> = {}): InternalLinkArticle {
  return {
    group: "test",
    id: "article",
    locale: "en",
    slug: "article",
    type: "guide",
    title: "Article",
    h1: "Article",
    metaDescription: "Article about charger evidence",
    summary: "charger evidence",
    contentMdx: "charger evidence",
    sections: [{ heading: "Evidence", body: "charger evidence" }],
    evidenceIds: [],
    indexStatus: "index",
    publishStatus: "published",
    ...overrides
  };
}
