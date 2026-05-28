import type { BaseProblemGuideDraftSpec } from "./sample-base-problem-guide-draft-types";

export const baseProblemGuideDraftSpecs: BaseProblemGuideDraftSpec[] = [
  {
    group: "guide-fake-watts",
    id: "art-en-guide-fake-watts",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-fake-watts",
    title: "AliExpress Charger Fake Watts: How to Spot Misleading 65W Listings",
    h1: "How to spot fake or misleading watts on AliExpress chargers",
    metaDescription:
      "Use variant checks, PD profile evidence, cable rating, and price zones to avoid charger listings where the headline wattage does not match the selected SKU.",
    summary:
      "The common problem is not always a fake product; it is often a 45W or no-cable option hiding under a 65W listing title.",
    contentMdx: "variant option plug cable evidence price verified seller claim",
    sectionHeadings: ["30-second answer", "Most common causes", "How to check before buying", "Flagged products", "Evidence"],
    evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-pps-observed", "vc-baseus-output"],
    qualityScore: 86
  },
  {
    group: "guide-not-charging",
    id: "art-en-guide-not-charging",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-not-charging-laptop",
    title: "AliExpress 65W Charger Not Charging a Laptop: Variant and Cable Checks",
    h1: "Why an AliExpress 65W charger may not charge your laptop",
    metaDescription:
      "Check the selected wattage variant, USB-C cable rating, PD/PPS profile evidence, and heat behavior before assuming the charger is defective.",
    summary:
      "Laptop charging failures usually trace back to the selected SKU, cable rating, or a PD profile mismatch.",
    contentMdx: "variant option plug cable evidence price verified laptop",
    sectionHeadings: ["30-second answer", "Selected SKU mismatch", "Cable rating check", "PD profile evidence", "Safer alternatives"],
    evidenceIds: ["rs-baseus-laptop-en", "var-baseus-45w-trap", "vc-baseus-pps-observed", "vc-baseus-output"],
    qualityScore: 84
  },
  {
    group: "guide-wrong-plug",
    id: "art-en-guide-wrong-plug",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-charger-wrong-plug-option",
    title: "Wrong Plug Option on AliExpress Chargers: How to Avoid the SKU Trap",
    h1: "How to avoid the wrong plug option on AliExpress chargers",
    metaDescription:
      "A practical guide to checking US, EU, and bundle variants before buying a USB-C charger from AliExpress.",
    summary:
      "The plug problem is a variant-selection problem, so the page maps which option carries which plug and cable bundle.",
    contentMdx: "variant option plug cable evidence price verified return",
    sectionHeadings: ["30-second answer", "Plug option map", "Bundle traps", "Return risk", "Evidence"],
    evidenceIds: ["rs-baseus-wrong-plug-en", "sc-baseus-cable", "risk-baseus-us", "var-baseus-65w-eu-cable"],
    qualityScore: 84
  }
];
