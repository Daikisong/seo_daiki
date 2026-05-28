import type { Article } from "@global-import-lab/types";
import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";

interface EnglishCategoryHubDraftInput {
  id: string;
  slug: string;
  title: string;
  summary: string;
  evidenceIds: string[];
  indexStatus?: Article["indexStatus"];
  qualityScore?: number;
}

function englishCategoryHubDraft(
  { updatedAt, internalLinks, sections }: BaseDraftArticleContext,
  { id, slug, title, summary, evidenceIds, indexStatus = "index", qualityScore = 84 }: EnglishCategoryHubDraftInput
): ArticleDraft {
  return {
    group: `hub-${slug}`,
    id,
    locale: "en",
    slug,
    type: "hub",
    title,
    h1: title,
    metaDescription: `${title} with seller claims, verified evidence, variant traps, price truth, and import risk notes.`,
    summary,
    contentMdx: "category hub product evidence variant price verified market risk methodology data lab guide compare",
    sections: sections(
      ["What this category verifies", "Products under watch", "Common traps", "Data, lab, and guides"],
      evidenceIds
    ),
    qualityScore,
    indexStatus,
    publishStatus: "published",
    internalLinks: internalLinks("en"),
    affiliateLinks: [],
    evidenceIds,
    lastUpdated: updatedAt
  };
}

export function buildBaseHubDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  const { updatedAt, internalLinks, sections } = context;

  return [
    {
      group: "hub-usb-c-chargers",
      id: "art-en-hub-chargers",
      locale: "en",
      slug: "usb-c-chargers",
      type: "hub",
      title: "USB-C Charger Verification Hub",
      h1: "USB-C Charger Verification Hub",
      metaDescription:
        "Compare AliExpress USB-C chargers by seller claims, verified output, plug options, price zones, and buyer risk.",
      summary:
        "A category hub for USB-C chargers that links product reviews, lab data, problem guides, and country risk notes.",
      contentMdx: "variant plug cable evidence price verified customs return alternative",
      sections: sections(
        ["What we verify", "Top products under watch", "Country risks", "Data and lab pages"],
        ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-us", "sc-ugreen-100w-title"]
      ),
      qualityScore: 91,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-us", "sc-ugreen-100w-title"],
      lastUpdated: updatedAt
    },
    {
      group: "hub-usb-c-chargers",
      id: "art-es-hub-chargers",
      locale: "es",
      slug: "cargadores-usb-c",
      type: "hub",
      title: "Centro de verificación de cargadores USB-C",
      h1: "Centro de verificación de cargadores USB-C",
      metaDescription:
        "Compara cargadores USB-C de importación por potencia verificada, opciones de enchufe, precio final y riesgo local.",
      summary:
        "Un hub para separar promesas del vendedor, datos medidos, variantes peligrosas y riesgos de compra en español.",
      contentMdx: "variant plug cable evidence price verified customs return alternative",
      sections: sections(
        ["Qué verificamos", "Productos bajo seguimiento", "Riesgos para España", "Datos y laboratorio"],
        ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-es", "sc-baseus-cable"]
      ),
      qualityScore: 88,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("es"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-es", "sc-baseus-cable"],
      lastUpdated: updatedAt
    },
    {
      group: "hub-usb-c-chargers",
      id: "art-pt-hub-chargers",
      locale: "pt-br",
      slug: "carregadores-usb-c",
      type: "hub",
      title: "Central de verificação de carregadores USB-C",
      h1: "Central de verificação de carregadores USB-C",
      metaDescription:
        "Compare carregadores USB-C importados por potência verificada, opções de plugue, preço final e risco no Brasil.",
      summary:
        "Um hub em português do Brasil para entender dados medidos, armadilhas de variante e riscos de importação.",
      contentMdx: "variant plug cable evidence price verified customs return alternative",
      sections: sections(
        ["O que verificamos", "Produtos monitorados", "Riscos no Brasil", "Dados e laboratório"],
        ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-br", "sc-baseus-cable"]
      ),
      qualityScore: 87,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("pt-br"),
      affiliateLinks: [],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-br", "sc-baseus-cable"],
      lastUpdated: updatedAt
    },
    englishCategoryHubDraft(context, {
      id: "art-en-hub-usb-c-cables",
      slug: "usb-c-cables",
      title: "USB-C Cable Verification Hub",
      summary:
        "A category hub for USB-C cables that focuses on e-marker evidence, wattage labels, length variants, and import price risk.",
      evidenceIds: ["vc-essager-emarker", "sc-essager-100w", "sc-essager-emarker", "risk-essager-us"]
    }),
    englishCategoryHubDraft(context, {
      id: "art-en-hub-power-banks",
      slug: "power-banks",
      title: "Power Bank Verification Hub",
      summary:
        "A category hub for imported power banks that separates claimed mAh, usable Wh, USB-C output, shipping cost, and return risk.",
      evidenceIds: [
        "vc-zmi-20000-power-bank-primary",
        "sc-zmi-20000-power-bank-primary",
        "sc-zmi-20000-power-bank-bundle",
        "risk-zmi-20000-power-bank-en"
      ]
    }),
    englishCategoryHubDraft(context, {
      id: "art-en-hub-electric-screwdrivers",
      slug: "electric-screwdrivers",
      title: "Electric Screwdriver Verification Hub",
      summary:
        "A pending category hub for imported electric screwdriver kits where accessory-only options can be mistaken for full kits.",
      evidenceIds: [
        "vc-hoto-screwdriver-kit-primary",
        "sc-hoto-screwdriver-kit-primary",
        "sc-hoto-screwdriver-kit-bundle",
        "risk-hoto-screwdriver-kit-en"
      ],
      indexStatus: "pending",
      qualityScore: 72
    }),
    englishCategoryHubDraft(context, {
      id: "art-en-hub-smart-home-sensors",
      slug: "smart-home-sensors",
      title: "Smart Home Sensor Verification Hub",
      summary:
        "A pending category hub for imported smart-home sensors where Wi-Fi and Zigbee options can share one listing.",
      evidenceIds: [
        "vc-tuya-zigbee-sensor-primary",
        "sc-tuya-zigbee-sensor-primary",
        "sc-tuya-zigbee-sensor-bundle",
        "risk-tuya-zigbee-sensor-en"
      ],
      indexStatus: "pending",
      qualityScore: 72
    })
  ];
}
