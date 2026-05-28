import type { BaseLocalizedGuideDraftSpec } from "./sample-base-localized-guide-draft-types";

export const baseLocalizedGuideDraftSpecs: BaseLocalizedGuideDraftSpec[] = [
  {
    group: "guide-fake-watts-es",
    id: "art-es-guide-fake-watts",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "cargador-aliexpress-watts-falsos",
    title: "Watts falsos en cargadores AliExpress: cómo revisar la variante",
    h1: "Cómo detectar watts falsos o confusos en cargadores AliExpress",
    metaDescription:
      "Revisa variante, enchufe, cable, perfil PD/PPS y precio final antes de comprar un cargador USB-C importado.",
    summary: "Muchos problemas salen de comprar la variante de 45W dentro de una ficha que anuncia 65W.",
    contentMdx: "variant option plug cable evidence price verified seller claim",
    sectionHeadings: ["Respuesta rápida", "Causas comunes", "Comprobación antes de comprar", "Productos marcados", "Evidencia"],
    evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-es"],
    qualityScore: 83
  },
  {
    group: "guide-fake-watts-pt",
    id: "art-pt-guide-fake-watts",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "carregador-aliexpress-watts-falsos",
    title: "Watts falsos em carregadores AliExpress: como revisar a variante",
    h1: "Como detectar watts falsos ou confusos em carregadores AliExpress",
    metaDescription:
      "Confira variante, plugue, cabo, perfil PD/PPS, preço final e risco de imposto antes de comprar.",
    summary: "O erro comum é escolher uma variante de 45W dentro de um anúncio que destaca 65W.",
    contentMdx: "variant option plug cable evidence price verified customs return",
    sectionHeadings: ["Resposta rápida", "Causas comuns", "Checagem antes da compra", "Produtos marcados", "Evidências"],
    evidenceIds: ["sc-baseus-65w-title", "var-baseus-45w-trap", "vc-baseus-output", "risk-baseus-br"],
    qualityScore: 82
  }
];
