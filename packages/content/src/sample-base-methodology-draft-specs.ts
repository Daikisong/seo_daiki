import type { BaseMethodologyDraftSpec } from "./sample-base-methodology-draft-types";

export const baseMethodologyDraftSpecs: BaseMethodologyDraftSpec[] = [
  {
    group: "methodology-test-chargers",
    id: "art-en-methodology-test",
    locale: "en",
    slug: "how-we-test-usb-c-chargers",
    title: "How We Test USB-C Chargers",
    h1: "How we test USB-C chargers",
    metaDescription:
      "The testing method behind the USB-C charger database: SKU selection, seller claim capture, PD profile checks, load testing, and risk scoring.",
    summary:
      "A methodology page explaining how seller claims become evidence records and when a page is allowed to be indexed.",
    contentMdx: "methodology variant option plug cable evidence price verified quality gate",
    sectionHeadings: ["SKU selection", "Seller claim ledger", "Load testing", "Risk scoring", "Index gate"],
    evidenceIds: ["sc-baseus-65w-title", "vc-baseus-output", "vc-baseus-temp", "risk-baseus-us"],
    qualityScore: 83
  },
  {
    group: "methodology-product-score",
    id: "art-en-methodology-score",
    locale: "en",
    slug: "how-we-score-aliexpress-products",
    title: "How We Score AliExpress Products",
    h1: "How we score AliExpress products",
    metaDescription:
      "The scoring method for imported products: identity confidence, seller claims, verified evidence, variant traps, price truth, and local risk.",
    summary:
      "This methodology explains why a page can be indexed only when evidence, unique buyer value, and internal-link context are strong enough.",
    contentMdx:
      "methodology quality score identity confidence seller claim verified data variant trap price truth locale risk index gate",
    sectionHeadings: ["Identity confidence", "Claim evidence", "Variant and price risk", "Locale risk", "Index decision"],
    evidenceIds: ["sc-baseus-65w-title", "vc-baseus-output", "risk-baseus-us", "vc-essager-emarker"],
    qualityScore: 84
  },
  {
    group: "methodology-price-truth",
    id: "art-en-methodology-price-truth",
    locale: "en",
    slug: "price-truth-score",
    title: "Price Truth Score Methodology",
    h1: "Price truth score methodology",
    metaDescription:
      "How Global Import Lab converts product price, shipping, coupons, SKU traps, and local return risk into buy, wait, or avoid zones.",
    summary:
      "The price truth score prevents cheap-looking imports from being recommended when shipping, coupons, SKU traps, or returns erase the savings.",
    contentMdx:
      "methodology price truth score normal price sale price shipping coupon final price buy wait avoid variant trap return risk",
    sectionHeadings: ["Normal price", "Coupon-adjusted price", "Final shipped price", "Buy/wait/avoid thresholds", "Risk overrides"],
    evidenceIds: ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"],
    qualityScore: 84
  }
];
