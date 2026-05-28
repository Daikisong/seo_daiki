import type { BaseRiskDraftSpec } from "./sample-base-risk-draft-types";

export const baseRiskDraftSpecs: BaseRiskDraftSpec[] = [
  {
    group: "risk-usb-c-import",
    id: "art-en-risk-usb-c-import",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-chargers-us-buyers",
    title: "AliExpress USB-C Chargers for US Buyers: Safety, Returns, and SKU Risk",
    h1: "AliExpress USB-C charger risks for US buyers",
    metaDescription:
      "A country-risk page for US buyers comparing plug fit, certification uncertainty, returns, local alternatives, and SKU traps before importing USB-C chargers.",
    summary:
      "US buyers face low customs risk, but certification uncertainty, return friction, and misleading charger variants still matter before clicking an affiliate link.",
    contentMdx: "country customs certification return local alternative variant plug cable evidence price verified risk",
    sectionHeadings: [
      "US buyer risk summary",
      "Certification and return tradeoffs",
      "Local alternatives",
      "Products to treat carefully",
      "Evidence"
    ],
    evidenceIds: ["risk-baseus-us", "sc-baseus-65w-title", "vc-baseus-output", "rs-baseus-wrong-plug-en"],
    qualityScore: 88
  },
  {
    group: "risk-usb-c-import-uk",
    id: "art-en-risk-usb-c-import-uk",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "aliexpress-chargers-uk-buyers",
    title: "AliExpress USB-C Chargers for UK Buyers: Plug, VAT, CE and Return Risk",
    h1: "AliExpress USB-C charger risks for UK buyers",
    metaDescription:
      "A country-risk page for UK buyers comparing plug choice, VAT-inclusive price, CE marking uncertainty, local returns, and AliExpress charger SKU traps.",
    summary:
      "UK buyers need a different rule from US buyers: check plug fit, VAT-inclusive landed price, CE claims, and whether a local retailer is safer.",
    contentMdx: "country uk vat ce plug return local alternative variant cable evidence price verified risk",
    sectionHeadings: [
      "UK buyer risk summary",
      "Plug and VAT tradeoffs",
      "CE marking and warranty",
      "When a local UK seller wins",
      "Evidence"
    ],
    evidenceIds: ["risk-baseus-gb", "sc-baseus-cable", "vc-baseus-output", "rs-baseus-wrong-plug-en"],
    qualityScore: 86
  },
  {
    group: "risk-usb-c-import",
    id: "art-es-risk-usb-c-import",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "cargadores-aliexpress-espana",
    title: "Cargadores AliExpress para España: enchufe, IVA, CE y devoluciones",
    h1: "Riesgos de comprar cargadores AliExpress desde España",
    metaDescription:
      "Riesgos locales para España: enchufe EU, IVA, declaraciones CE, devoluciones y alternativas locales antes de importar cargadores USB-C.",
    summary:
      "En España el enchufe EU ayuda, pero el precio final, la marca CE no verificada y las devoluciones pueden eliminar la ventaja de importar.",
    contentMdx: "country customs certification return local alternative variant plug cable evidence price verified risk españa",
    sectionHeadings: ["Resumen para España", "Enchufe EU e IVA", "CE y garantía", "Cuándo comprar local", "Evidencia"],
    evidenceIds: ["risk-baseus-es", "sc-baseus-cable", "vc-baseus-output", "rs-baseus-compact-es"],
    qualityScore: 87
  },
  {
    group: "risk-usb-c-import",
    id: "art-pt-risk-usb-c-import",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "carregadores-aliexpress-brasil",
    title: "Carregadores AliExpress no Brasil: imposto, atraso, plugue e devolução",
    h1: "Riscos de importar carregadores AliExpress para o Brasil",
    metaDescription:
      "Página de risco local para o Brasil: imposto, frete, atraso, plugue, devolução e quando comparar com Mercado Livre.",
    summary:
      "No Brasil, o risco principal não é só o carregador; imposto, atraso, plugue e devolução podem apagar o preço baixo.",
    contentMdx: "country customs certification return local alternative variant plug cable evidence price verified risk brasil",
    sectionHeadings: ["Resumo para o Brasil", "Imposto e atraso", "Plugue e certificação", "Quando comprar local", "Evidências"],
    evidenceIds: ["risk-baseus-br", "rs-baseus-customs-pt", "sc-baseus-cable", "vc-baseus-output"],
    qualityScore: 87
  }
];
