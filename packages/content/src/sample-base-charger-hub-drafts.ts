import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";
import { buildHubDraft } from "./sample-base-hub-draft-builder";
import type { HubDraftSpec } from "./sample-base-hub-draft-types";

export const chargerHubDraftSpecs: HubDraftSpec[] = [
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
    sectionHeadings: ["What we verify", "Top products under watch", "Country risks", "Data and lab pages"],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-us", "sc-ugreen-100w-title"],
    qualityScore: 91,
    indexStatus: "index"
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
    sectionHeadings: ["Qué verificamos", "Productos bajo seguimiento", "Riesgos para España", "Datos y laboratorio"],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-es", "sc-baseus-cable"],
    qualityScore: 88,
    indexStatus: "index"
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
    sectionHeadings: ["O que verificamos", "Produtos monitorados", "Riscos no Brasil", "Dados e laboratório"],
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "risk-baseus-br", "sc-baseus-cable"],
    qualityScore: 87,
    indexStatus: "index"
  }
];

export function buildChargerHubDrafts(context: BaseDraftArticleContext): ArticleDraft[] {
  return chargerHubDraftSpecs.map((spec) => buildHubDraft(context, spec));
}
