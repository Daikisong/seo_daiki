import assert from "node:assert/strict";
import type { Article, InternalLink } from "@global-import-lab/types";
import { validateHreflang } from "@global-import-lab/validators/hreflangValidator";
import { validateInternalLinks } from "@global-import-lab/validators/internalLinks";
import { validateSeoIntegrity } from "@global-import-lab/validators/seoIntegrity";

const canonical = "https://example.com/en/buyer-guides/usb-c-charger/";
const baseArticle: Article = {
  id: "article-1",
  locale: "en",
  slug: "usb-c-charger",
  type: "buyer_guide",
  title: "USB-C Charger Evidence Guide for Safer Import Buying",
  h1: "USB-C Charger Evidence Guide",
  metaDescription:
    "Evidence-based USB-C charger guide with canonical routing, hreflang alternates, internal links, and safer buying checks.",
  summary: "Charging and safety evidence for USB-C charger buyers with source-backed checks and market risk notes.",
  contentMdx: "This article covers charger evidence, safer picks, variant traps, price truth, and buying risk.",
  sections: [{ heading: "Evidence", body: "65W charger measurements and safety checks" }],
  jsonLd: {},
  qualityScore: 90,
  indexStatus: "index",
  publishStatus: "published",
  canonicalUrl: canonical,
  hreflangMap: { en: canonical, "x-default": "https://example.com/" },
  internalLinks: fiveLinks(),
  affiliateLinks: [],
  evidenceIds: ["ev-1", "ev-2", "ev-3"],
  lastUpdated: "2026-05-27"
};

assert.deepEqual(validateHreflang(baseArticle), []);
assert.deepEqual(validateSeoIntegrity(baseArticle), []);
assert.deepEqual(validateInternalLinks(baseArticle), []);

assert.deepEqual(
  validateHreflang({ ...baseArticle, hreflangMap: {} }).map((issue) => issue.code),
  ["hreflang_self_missing", "hreflang_default_missing"]
);

assert.equal(validateInternalLinks({ ...baseArticle, internalLinks: fiveLinks().slice(0, 2) })[0]?.code, "internal_links_low");

assert.deepEqual(
  validateSeoIntegrity({
    ...baseArticle,
    canonicalUrl: "https://example.com/wrong/",
    hreflangMap: { en: "https://example.com/wrong/", "x-default": "https://example.com/" },
    title: "Best USB-C Charger 2026",
    metaDescription: "Too short",
    slug: "USB_Charger"
  }).map((issue) => issue.code),
  [
    "canonical_mismatch",
    "hreflang_self_mismatch",
    "slug_format_invalid",
    "title_length_outside_seo_range",
    "meta_description_length_outside_seo_range",
    "generic_best_year_title"
  ]
);

assert.equal(validateSeoIntegrity({ ...baseArticle, hreflangMap: { en: "/relative/", "x-default": "https://example.com/" } })[0]?.code, "hreflang_self_mismatch");
assert.equal(
  validateSeoIntegrity({ ...baseArticle, hreflangMap: { en: canonical, es: "/es/relative/", "x-default": "https://example.com/" } }).at(-1)?.code,
  "hreflang_not_absolute"
);

console.log("SEO guard unit tests passed");

function fiveLinks(): InternalLink[] {
  return Array.from({ length: 5 }, (_, index) => ({
    label: `internal ${index}`,
    href: `/en/data/internal-${index}/`,
    reason: "evidence"
  }));
}
