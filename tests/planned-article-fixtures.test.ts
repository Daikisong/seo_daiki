import assert from "node:assert/strict";
import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";
import { generatedProductFixtures } from "../packages/content/src/product-fixtures";
import {
  buildGeneratedDraftArticles,
  buildPlannedArticle,
  initialUrlPlan,
  plannedEvidenceIds,
  plannedIndexTargetTotal,
  plannedLocaleText,
  plannedSlug,
  plannedTypeText,
  plannedUrlTotal
} from "../packages/content/src/planned-article-fixtures";

const updatedAt = "2030-01-02";
const products = generatedProductFixtures(updatedAt);

const context = {
  products,
  updatedAt,
  internalLinks(locale: Locale): InternalLink[] {
    return [{ label: `${locale} evidence hub`, href: `/${locale}/usb-c-import-verification-hub-01/`, reason: "hub" }];
  },
  sections(headings: string[], evidenceIds: string[]): ArticleSection[] {
    return headings.map((heading, index) => ({
      heading,
      body: `Section ${index + 1}`,
      evidenceIds: evidenceIds.slice(index, index + 2)
    }));
  }
};

assert.equal(initialUrlPlan.length, 14);
assert.equal(plannedUrlTotal, 110);
assert.equal(plannedIndexTargetTotal, 34);

const generated = buildGeneratedDraftArticles(context);
assert.equal(generated.length, 110);
assert.equal(generated.filter((article) => article.indexStatus === "index").length, 34);
assert.equal(generated.filter((article) => article.publishStatus === "published").length, 34);
assert.equal(generated.filter((article) => article.publishStatus === "draft").length, 76);

const firstHub = generated[0];
assert.equal(firstHub.id, "art-planned-en-hub-01");
assert.equal(firstHub.slug, "usb-c-import-verification-hub-01");
assert.equal(firstHub.productId, undefined);
assert.equal(firstHub.affiliateLinks.length, 0);
assert.equal(firstHub.qualityScore, 84);
assert.equal(firstHub.lastUpdated, updatedAt);
assert.deepEqual(firstHub.internalLinks.map((link) => link.reason), ["hub"]);

const firstReview = generated.find((article) => article.id === "art-planned-en-review-01");
assert.ok(firstReview);
assert.equal(firstReview.productId, products[0]?.id);
assert.equal(firstReview.indexStatus, "index");
assert.equal(firstReview.affiliateLinks.length, 1);
assert.equal(firstReview.affiliateLinks[0]?.rel, "sponsored nofollow");
assert.equal(firstReview.affiliateLinks[0]?.href, products[0]?.variants[0]?.affiliateUrl);

const secondEnglishReview = generated.find((article) => article.id === "art-planned-en-review-02");
assert.ok(secondEnglishReview);
assert.equal(secondEnglishReview.indexStatus, "pending");
assert.equal(secondEnglishReview.publishStatus, "draft");
assert.equal(secondEnglishReview.qualityScore, 62);

const spanishGuide = generated.find((article) => article.id === "art-planned-es-guide-01");
assert.ok(spanishGuide);
assert.equal(spanishGuide.slug, "verificacion-importacion-usb-c-guide-01");
assert.ok(spanishGuide.title.startsWith("Importación USB-C guía 1"));
assert.equal(spanishGuide.sections[0]?.heading, "Intención de búsqueda");

const portugueseReview = generated.find((article) => article.id === "art-planned-pt-br-review-01");
assert.ok(portugueseReview);
assert.equal(portugueseReview.slug, "verificacao-importacao-usb-c-review-01");
assert.ok(portugueseReview.title.startsWith("Importação USB-C análise 1"));
assert.equal(portugueseReview.sections[0]?.heading, "Intenção de busca");

assert.equal(plannedSlug({ locale: "en", type: "lab", count: 1, indexTarget: 1, cluster: "usb-c" }, 7), "usb-c-import-verification-lab-07");
assert.equal(plannedLocaleText("pt-br").affiliateLabel, "Ver preço atual no AliExpress");
assert.deepEqual(plannedTypeText("data", "es"), { title: "data", h1: "data" });

const spanishEvidence = plannedEvidenceIds(products, "es", products[0]?.id ?? "");
assert.ok(spanishEvidence.includes(`rs-toocki-67w-es`));
assert.ok(spanishEvidence.includes(`risk-toocki-67w-es`));
assert.ok(spanishEvidence.includes(`vc-toocki-67w-primary`));
assert.ok(spanishEvidence.includes(`sc-toocki-67w-primary`));

const customReview = buildPlannedArticle(
  { locale: "en", type: "review", count: 1, indexTarget: 0, cluster: "usb-c charging" },
  1,
  context
);
assert.equal(customReview.indexStatus, "pending");
assert.equal(customReview.publishStatus, "draft");
assert.equal(customReview.affiliateLinks.length, 1);

console.log("Planned article fixture unit tests passed");
