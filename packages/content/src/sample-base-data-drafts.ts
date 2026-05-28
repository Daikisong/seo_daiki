import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";

export function buildBaseDataDrafts({
  updatedAt,
  internalLinks,
  sections
}: BaseDraftArticleContext): ArticleDraft[] {
  return [
    {
      group: "data-output-table",
      id: "art-en-data-output",
      productId: "prod-baseus-65w",
      locale: "en",
      slug: "65w-gan-charger-output-table",
      type: "data",
      title: "AliExpress 65W GaN Charger Output Verification Table",
      h1: "AliExpress 65W GaN charger output verification table",
      metaDescription:
        "A structured table of seller wattage claims, sustained output evidence, temperature notes, SKU traps, and update history.",
      summary:
        "This dataset is the evidence source for charger reviews, comparison pages, and problem-solving guides.",
      contentMdx: "BenchmarkTable DatasetDownload variant option plug cable evidence price verified",
      sections: sections(
        ["Methodology", "Benchmark table", "Suspicious claim gaps", "Dataset download", "Update log"],
        ["vc-baseus-output", "vc-baseus-temp", "vc-ugreen-output", "sc-baseus-65w-title"]
      ),
      qualityScore: 92,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-ugreen-output", "sc-baseus-65w-title"],
      lastUpdated: updatedAt
    },
    {
      group: "data-cable-100w-table",
      id: "art-en-data-cable-100w",
      productId: "prod-essager-cable-100w",
      locale: "en",
      slug: "usb-c-cable-100w-verification-table",
      type: "data",
      title: "USB-C Cable 100W Verification Table",
      h1: "USB-C cable 100W verification table",
      metaDescription:
        "A structured evidence table for USB-C cable wattage labels, e-marker checks, length variants, and import price risk.",
      summary:
        "This data page records which cable claims are seller labels, which e-marker checks exist, and when a cheap cable still carries variant risk.",
      contentMdx: "DatasetDownload BenchmarkTable cable e-marker 100W variant length evidence price verified",
      sections: sections(
        ["Dataset scope", "E-marker evidence", "Length and SKU traps", "Price truth", "Reusable evidence"],
        ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "sc-essager-length", "risk-essager-us"]
      ),
      qualityScore: 89,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "sc-essager-length", "risk-essager-us"],
      lastUpdated: updatedAt
    },
    {
      group: "data-power-bank-mah-wh",
      id: "art-en-data-power-bank-wh",
      productId: "prod-zmi-20000-power-bank",
      locale: "en",
      slug: "power-bank-claimed-mah-vs-real-wh",
      type: "data",
      title: "Power Bank Claimed mAh vs Usable Wh Table",
      h1: "Power bank claimed mAh vs usable Wh table",
      metaDescription:
        "A data page explaining imported power bank mAh claims, observed Wh, USB-C output, shipping price, and local return risk.",
      summary:
        "Power bank capacity claims must be interpreted as cell rating first, then compared with usable output energy and import risk.",
      contentMdx: "DatasetDownload BenchmarkTable power bank capacity mAh Wh USB-C output evidence price customs return",
      sections: sections(
        ["Dataset scope", "mAh versus Wh", "USB-C output evidence", "Shipping and return risk", "Reusable evidence"],
        [
          "vc-zmi-20000-power-bank-primary",
          "sc-zmi-20000-power-bank-primary",
          "sc-zmi-20000-power-bank-bundle",
          "risk-zmi-20000-power-bank-en"
        ]
      ),
      qualityScore: 86,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: [
        "vc-zmi-20000-power-bank-primary",
        "sc-zmi-20000-power-bank-primary",
        "sc-zmi-20000-power-bank-bundle",
        "risk-zmi-20000-power-bank-en"
      ],
      lastUpdated: updatedAt
    },
    {
      group: "lab-output-test",
      id: "art-en-lab-output",
      productId: "prod-baseus-65w",
      locale: "en",
      slug: "65w-gan-charger-real-output-test",
      type: "lab",
      title: "65W GaN Charger Real Output Test",
      h1: "65W GaN charger real output test",
      metaDescription:
        "Lab notes for sustained output, case temperature, PD/PPS profile capture, and variant caveats for AliExpress 65W chargers.",
      summary:
        "The lab page records how the output and temperature numbers were collected before they are reused on review pages.",
      contentMdx: "TestMethodBlock BenchmarkTable variant option plug cable evidence price verified",
      sections: sections(
        ["Test method", "Load result", "Temperature note", "Profile capture", "Reusable evidence"],
        ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title"]
      ),
      qualityScore: 91,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title"],
      lastUpdated: updatedAt
    }
  ];
}
