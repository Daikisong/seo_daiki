import type { ArticleDraft } from "./article-draft-types";
import type { BuildBaseDraftArticlesOptions } from "./sample-base-draft-context";
import { buildBaseHubDrafts } from "./sample-base-hub-drafts";
import { buildBaseProblemGuideDrafts } from "./sample-base-problem-guide-drafts";
import { buildBaseReviewDrafts } from "./sample-base-review-drafts";
import { buildBaseRiskDrafts } from "./sample-base-risk-drafts";

export function buildBaseDraftArticles(context: BuildBaseDraftArticlesOptions): ArticleDraft[] {
  const {
    updatedAt,
    internalLinks: sampleInternalLinks,
    sections: sampleSections
  } = context;

  return [
    ...buildBaseHubDrafts(context),
    ...buildBaseRiskDrafts(context),
    ...buildBaseReviewDrafts(context),
    ...buildBaseProblemGuideDrafts(context),
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
      sections: sampleSections(
        ["Comparison table", "Verified output gap", "Cable requirement", "Price zones", "Who should avoid each"],
        ["vc-baseus-output", "vc-ugreen-output", "sc-ugreen-100w-title", "ps-ugreen-us"]
      ),
      qualityScore: 88,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
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
      sections: sampleSections(
        ["Comparison rule", "Price gap", "Return and certification risk", "When local wins", "Evidence"],
        ["vc-baseus-output", "sc-baseus-65w-title", "risk-baseus-us", "ps-baseus-us"]
      ),
      qualityScore: 86,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "sc-baseus-65w-title", "risk-baseus-us", "ps-baseus-us"],
      lastUpdated: updatedAt
    },
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
      sections: sampleSections(
        ["Methodology", "Benchmark table", "Suspicious claim gaps", "Dataset download", "Update log"],
        ["vc-baseus-output", "vc-baseus-temp", "vc-ugreen-output", "sc-baseus-65w-title"]
      ),
      qualityScore: 92,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
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
      sections: sampleSections(
        ["Dataset scope", "E-marker evidence", "Length and SKU traps", "Price truth", "Reusable evidence"],
        ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "sc-essager-length", "risk-essager-us"]
      ),
      qualityScore: 89,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
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
      sections: sampleSections(
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
      internalLinks: sampleInternalLinks("en"),
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
      sections: sampleSections(
        ["Test method", "Load result", "Temperature note", "Profile capture", "Reusable evidence"],
        ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title"]
      ),
      qualityScore: 91,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title"],
      lastUpdated: updatedAt
    },
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
      sections: sampleSections(
        ["SKU selection", "Seller claim ledger", "Load testing", "Risk scoring", "Index gate"],
        ["sc-baseus-65w-title", "vc-baseus-output", "vc-baseus-temp", "risk-baseus-us"]
      ),
      qualityScore: 83,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
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
      sections: sampleSections(
        ["Identity confidence", "Claim evidence", "Variant and price risk", "Locale risk", "Index decision"],
        ["sc-baseus-65w-title", "vc-baseus-output", "risk-baseus-us", "vc-essager-emarker"]
      ),
      qualityScore: 84,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
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
      sections: sampleSections(
        ["Normal price", "Coupon-adjusted price", "Final shipped price", "Buy/wait/avoid thresholds", "Risk overrides"],
        ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"]
      ),
      qualityScore: 84,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["ps-baseus-us", "ps-essager-us", "risk-baseus-us", "risk-essager-us"],
      lastUpdated: updatedAt
    },
    {
      group: "guide-fake-watts-es",
      id: "art-es-guide-fake-watts",
      productId: "prod-baseus-65w",
      locale: "es",
      slug: "cargador-aliexpress-watts-falsos",
      type: "guide",
      title: "Watts falsos en cargadores AliExpress: cómo revisar la variante",
      h1: "Cómo detectar watts falsos o confusos en cargadores AliExpress",
      metaDescription:
        "Revisa variante, enchufe, cable, perfil PD/PPS y precio final antes de comprar un cargador USB-C importado.",
      summary:
        "Muchos problemas salen de comprar la variante de 45W dentro de una ficha que anuncia 65W.",
      contentMdx: "variant option plug cable evidence price verified seller claim",
      sections: sampleSections(
        ["Respuesta rápida", "Causas comunes", "Comprobación antes de comprar", "Productos marcados", "Evidencia"],
        ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-es"]
      ),
      qualityScore: 83,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("es"),
      affiliateLinks: [],
      evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-es"],
      lastUpdated: updatedAt
    },
    {
      group: "guide-fake-watts-pt",
      id: "art-pt-guide-fake-watts",
      productId: "prod-baseus-65w",
      locale: "pt-br",
      slug: "carregador-aliexpress-watts-falsos",
      type: "guide",
      title: "Watts falsos em carregadores AliExpress: como revisar a variante",
      h1: "Como detectar watts falsos ou confusos em carregadores AliExpress",
      metaDescription:
        "Confira variante, plugue, cabo, perfil PD/PPS, preço final e risco de imposto antes de comprar.",
      summary:
        "O erro comum é escolher uma variante de 45W dentro de um anúncio que destaca 65W.",
      contentMdx: "variant option plug cable evidence price verified customs return",
      sections: sampleSections(
        ["Resposta rápida", "Causas comuns", "Checagem antes da compra", "Produtos marcados", "Evidências"],
        ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-br"]
      ),
      qualityScore: 82,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: sampleInternalLinks("pt-br"),
      affiliateLinks: [],
      evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-br"],
      lastUpdated: updatedAt
    },
    {
      group: "pending-review-ugreen",
      id: "art-en-review-ugreen-pending",
      productId: "prod-ugreen-100w",
      locale: "en",
      slug: "ugreen-100w-gan-charger-output",
      type: "review",
      title: "Ugreen 100W GaN Charger Output Notes",
      h1: "Ugreen 100W GaN charger output notes",
      metaDescription: "Pending review page waiting for more variant and locale-risk evidence.",
      summary: "This draft is intentionally pending because it needs more local risk and review signal evidence.",
      contentMdx: "variant evidence price pending",
      sections: sampleSections(["Draft notes", "Missing evidence", "Next checks"], ["vc-ugreen-output", "sc-ugreen-100w-title"]),
      qualityScore: 66,
      indexStatus: "pending",
      publishStatus: "draft",
      internalLinks: sampleInternalLinks("en").slice(0, 3),
      affiliateLinks: [
        {
          label: "Check current AliExpress price",
          href: "https://example.com/go/ugreen-100w",
          rel: "sponsored nofollow"
        }
      ],
      evidenceIds: ["vc-ugreen-output", "sc-ugreen-100w-title"],
      lastUpdated: updatedAt
    }
  ];
}
