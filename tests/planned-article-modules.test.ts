import assert from "node:assert/strict";
import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";
import { generatedProductFixtures } from "../packages/content/src/product-fixtures";
import { buildGeneratedDraftArticles } from "../packages/content/src/planned-article-builder";
import { plannedLocaleText, plannedTypeText } from "../packages/content/src/planned-article-copy";
import { plannedEvidenceIds } from "../packages/content/src/planned-article-evidence";
import { plannedSlug } from "../packages/content/src/planned-article-slug";
import { initialUrlPlan, plannedIndexTargetTotal, plannedUrlTotal } from "../packages/content/src/planned-article-url-plan";

const updatedAt = "2030-04-05";
const products = generatedProductFixtures(updatedAt);
const context = {
  products,
  updatedAt,
  internalLinks(locale: Locale): InternalLink[] {
    return [{ label: `${locale} planned hub`, href: `/${locale}/planned/`, reason: "planned" }];
  },
  sections(headings: string[], evidenceIds: string[]): ArticleSection[] {
    return headings.map((heading) => ({
      heading,
      body: "Planned article module test section",
      evidenceIds
    }));
  }
};

assert.equal(initialUrlPlan.length, 14);
assert.equal(plannedUrlTotal, 110);
assert.equal(plannedIndexTargetTotal, 34);
assert.deepEqual(initialUrlPlan.slice(0, 3).map((row) => row.type), ["hub", "data", "lab"]);

assert.equal(
  plannedSlug({ locale: "pt-br", type: "review", count: 1, indexTarget: 1, cluster: "usb-c" }, 3),
  "verificacao-importacao-usb-c-review-03"
);
assert.equal(plannedLocaleText("es").sections[0], "Intención de búsqueda");
assert.deepEqual(plannedTypeText("data", "es"), { title: "data", h1: "data" });
assert.deepEqual(plannedTypeText("compare", "en"), { title: "comparison", h1: "USB-C product comparison" });

const fallbackEvidenceIds = plannedEvidenceIds(products, "pt-br", "missing-product");
assert.equal(fallbackEvidenceIds.includes(products[0]?.verifiedClaims[0]?.id ?? ""), true);
assert.equal(fallbackEvidenceIds.includes(products[0]?.sellerClaims[0]?.id ?? ""), true);

const generated = buildGeneratedDraftArticles(context, [
  { locale: "en", type: "review", count: 2, indexTarget: 1, cluster: "usb-c charging" }
]);
assert.equal(generated.length, 2);
assert.equal(generated[0]?.indexStatus, "index");
assert.equal(generated[1]?.indexStatus, "pending");
assert.equal(generated[0]?.affiliateLinks[0]?.rel, "sponsored nofollow");
assert.equal(generated[0]?.internalLinks[0]?.reason, "planned");

console.log("Planned article module tests passed");
