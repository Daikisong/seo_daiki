import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import {
  articleText,
  booleanJsonField,
  hostForUrl,
  hostMatchesDomain,
  isRecord,
  normalizeUrl,
  numericJsonField,
  recordField,
  sharedCommerceTerm,
  stringField,
  stringJsonField
} from "../packages/validators/src/validationUtils";
import {
  articleText as directArticleText,
  sharedCommerceTerm as directSharedCommerceTerm
} from "../packages/validators/src/validationArticleText";
import {
  booleanJsonField as directBooleanJsonField,
  numericJsonField as directNumericJsonField,
  stringJsonField as directStringJsonField
} from "../packages/validators/src/validationJsonFields";
import { isRecord as directIsRecord } from "../packages/validators/src/validationRecordUtils";
import {
  recordField as directRecordField,
  stringField as directStringField
} from "../packages/validators/src/validationSchemaFields";
import {
  hostForUrl as directHostForUrl,
  hostMatchesDomain as directHostMatchesDomain,
  normalizeUrl as directNormalizeUrl
} from "../packages/validators/src/validationUrlUtils";

assert.equal(articleText, directArticleText);
assert.equal(sharedCommerceTerm, directSharedCommerceTerm);
assert.equal(numericJsonField, directNumericJsonField);
assert.equal(stringJsonField, directStringJsonField);
assert.equal(booleanJsonField, directBooleanJsonField);
assert.equal(isRecord, directIsRecord);
assert.equal(recordField, directRecordField);
assert.equal(stringField, directStringField);
assert.equal(hostForUrl, directHostForUrl);
assert.equal(hostMatchesDomain, directHostMatchesDomain);
assert.equal(normalizeUrl, directNormalizeUrl);

const article: Article = {
  id: "article-1",
  locale: "en",
  slug: "usb-c-charger",
  type: "buyer_guide",
  title: "USB-C charger guide",
  h1: "USB-C charger guide",
  metaDescription: "Evidence based charger guide",
  summary: "Charging and safety evidence",
  contentMdx: "This article covers charger evidence and safer picks.",
  sections: [{ heading: "Evidence", body: "65W charger measurements" }],
  jsonLd: {},
  qualityScore: 90,
  indexStatus: "index",
  publishStatus: "published",
  hreflangMap: {},
  internalLinks: [{ label: "charger data", href: "/en/data/charger/", reason: "data" }],
  affiliateLinks: [{ label: "charger offer", href: "https://merchant.example/product", rel: "sponsored nofollow", merchantSlug: "merchant" }],
  evidenceIds: ["ev-1"],
  lastUpdated: "2026-05-27"
};

assert.equal(normalizeUrl("https://example.com/a?x=1#top"), "https://example.com/a/");
assert.equal(hostForUrl("/api/affiliate-click/abc"), "example.com");
assert.equal(hostMatchesDomain("shop.example.com", "*.example.com"), true);
assert.equal(numericJsonField({ score: 82 }, "score"), 82);
assert.equal(stringJsonField({ status: "localized" }, "status"), "localized");
assert.equal(booleanJsonField({ translationOnly: true }, "translationOnly"), true);
assert.equal(recordField({ nested: { ok: true } }, "nested")?.ok, true);
assert.equal(stringField({ type: "Article" }, "type"), "Article");
assert.equal(sharedCommerceTerm("charger evidence safer picks", "USB charger offer"), true);
assert.match(articleText(article), /charger offer/);
assert.equal(isRecord([]), false);

console.log("Validation utility module tests passed");
