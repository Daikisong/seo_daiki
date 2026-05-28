import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";

export function buildBaseComparisonDrafts({
  updatedAt,
  internalLinks,
  sections
}: BaseDraftArticleContext): ArticleDraft[] {
  return [
    {
      group: "compare-65w-100w",
      id: "art-en-compare-65w-100w",
      productId: "prod-baseus-65w",
      locale: "en",
      slug: "65w-vs-100w-gan-charger",
      type: "compare",
      title: "65W vs 100W GaN Charger: Real Output, Price, and Buyer Risk",
      h1: "65W vs 100W GaN Charger: which one should you import?",
      metaDescription:
        "Compare 65W and 100W GaN charger claims against verified output, heat, cable requirements, price zones, and local buyer risk.",
      summary:
        "A 65W charger is usually the lower-risk travel buy; 100W makes sense only when your laptop and cable setup can use it.",
      contentMdx: "variant option plug cable evidence price verified comparison alternative",
      sections: sections(
        ["Comparison table", "Verified output gap", "Cable requirement", "Price zones", "Who should avoid each"],
        ["vc-baseus-output", "vc-ugreen-output", "sc-ugreen-100w-title", "ps-ugreen-us"]
      ),
      qualityScore: 88,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-ugreen-output", "sc-ugreen-100w-title", "ps-ugreen-us"],
      lastUpdated: updatedAt
    },
    {
      group: "compare-import-local-alternative",
      id: "art-en-compare-import-local-alternative",
      productId: "prod-baseus-65w",
      locale: "en",
      slug: "aliexpress-charger-vs-amazon-alternative",
      type: "compare",
      title: "AliExpress Charger vs Local Alternative: Price, Returns, and Evidence",
      h1: "AliExpress charger vs local alternative: when import savings are not enough",
      metaDescription:
        "Compare imported USB-C charger savings against local marketplace returns, certification confidence, final shipped price, and SKU risk.",
      summary:
        "Importing makes sense only when the selected SKU is verified and the final price gap beats return and certification friction.",
      contentMdx: "compare local alternative price return certification customs variant evidence verified",
      sections: sections(
        ["Comparison rule", "Price gap", "Return and certification risk", "When local wins", "Evidence"],
        ["vc-baseus-output", "sc-baseus-65w-title", "risk-baseus-us", "ps-baseus-us"]
      ),
      qualityScore: 86,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "sc-baseus-65w-title", "risk-baseus-us", "ps-baseus-us"],
      lastUpdated: updatedAt
    }
  ];
}
