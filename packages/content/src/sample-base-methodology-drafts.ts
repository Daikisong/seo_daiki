import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";

export function buildBaseMethodologyDrafts({
  updatedAt,
  internalLinks,
  sections
}: BaseDraftArticleContext): ArticleDraft[] {
  return [
    {
      group: "methodology-test-chargers",
      id: "art-en-methodology-test",
      locale: "en",
      slug: "how-we-test-usb-c-chargers",
      type: "methodology",
      title: "How We Test USB-C Chargers",
      h1: "How we test USB-C chargers",
      metaDescription:
        "The testing method behind the USB-C charger database: SKU selection, seller claim capture, PD profile checks, load testing, and risk scoring.",
      summary:
        "A methodology page explaining how seller claims become evidence records and when a page is allowed to be indexed.",
      contentMdx: "methodology variant option plug cable evidence price verified quality gate",
      sections: sections(
        ["SKU selection", "Seller claim ledger", "Load testing", "Risk scoring", "Index gate"],
        ["sc-baseus-65w-title", "vc-baseus-output", "vc-baseus-temp", "risk-baseus-us"]
      ),
      qualityScore: 83,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["sc-baseus-65w-title", "vc-baseus-output", "vc-baseus-temp", "risk-baseus-us"],
      lastUpdated: updatedAt
    },
    {
      group: "methodology-product-score",
      id: "art-en-methodology-score",
      locale: "en",
      slug: "how-we-score-aliexpress-products",
      type: "methodology",
      title: "How We Score AliExpress Products",
      h1: "How we score AliExpress products",
      metaDescription:
        "The scoring method for imported products: identity confidence, seller claims, verified evidence, variant traps, price truth, and local risk.",
      summary:
        "This methodology explains why a page can be indexed only when evidence, unique buyer value, and internal-link context are strong enough.",
      contentMdx: "methodology quality score identity confidence seller claim verified data variant trap price truth locale risk index gate",
      sections: sections(
        ["Identity confidence", "Claim evidence", "Variant and price risk", "Locale risk", "Index decision"],
        ["sc-baseus-65w-title", "vc-baseus-output", "risk-baseus-us", "vc-essager-emarker"]
      ),
      qualityScore: 84,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["sc-baseus-65w-title", "vc-baseus-output", "risk-baseus-us", "vc-essager-emarker"],
      lastUpdated: updatedAt
    },
    {
      group: "methodology-price-truth",
      id: "art-en-methodology-price-truth",
      locale: "en",
      slug: "price-truth-score",
      type: "methodology",
      title: "Price Truth Score Methodology",
      h1: "Price truth score methodology",
      metaDescription:
        "How Global Import Lab converts product price, shipping, coupons, SKU traps, and local return risk into buy, wait, or avoid zones.",
      summary:
        "The price truth score prevents cheap-looking imports from being recommended when shipping, coupons, SKU traps, or returns erase the savings.",
      contentMdx: "methodology price truth score normal price sale price shipping coupon final price buy wait avoid variant trap return risk",
      sections: sections(
        ["Normal price", "Coupon-adjusted price", "Final shipped price", "Buy/wait/avoid thresholds", "Risk overrides"],
        ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"]
      ),
      qualityScore: 84,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"],
      lastUpdated: updatedAt
    }
  ];
}
