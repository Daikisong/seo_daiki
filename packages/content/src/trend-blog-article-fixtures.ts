import type { ArticleSection, InternalLink, Locale } from "@global-import-lab/types";
import type { ArticleDraft } from "./article-draft-types";

export type TrendBlogArticleType = "trend" | "buyer_guide" | "deal_watch" | "ingredient_guide";

export interface TrendBlogArticleSpec {
  group: string;
  id: string;
  productId?: string;
  locale: Locale;
  slug: string;
  type: TrendBlogArticleType;
  title: string;
  h1: string;
  metaDescription: string;
  summary: string;
  contentMdx: string;
  evidenceIds: string[];
  headings: string[];
  affiliateLabel?: string;
  affiliateHref?: string;
}

export interface TrendBlogArticleContext {
  updatedAt: string;
  internalLinks: (locale: Locale) => InternalLink[];
  sections: (headings: string[], evidenceIds: string[]) => ArticleSection[];
}

export const trendBlogArticleSpecs: TrendBlogArticleSpec[] = [
  {
    group: "trend-travel-gan-charger",
    id: "art-en-trend-travel-gan-charger",
    locale: "en",
    slug: "travel-gan-charger-fake-wattage-trend",
    type: "trend",
    title: "Travel GaN charger fake wattage trend evidence brief",
    h1: "Travel GaN charger fake wattage trend evidence brief",
    metaDescription:
      "Why travel GaN charger fake-wattage searches are rising, which evidence is needed, and where cautious buyers should look next.",
    summary:
      "Search demand is rising around compact travel chargers, but the useful angle is evidence: SKU traps, output claims, price zones, and return risk.",
    contentMdx: "trend source signals rising evidence verified variant price risk affiliate localization update log",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-65w-title", "risk-baseus-us", "rs-baseus-laptop-en"],
    headings: ["Trend summary", "Why it is rising", "Evidence and source signals", "Related buyer problems", "Localization notes"]
  },
  {
    group: "trend-travel-gan-charger",
    id: "art-es-trend-travel-gan-charger",
    locale: "es",
    slug: "tendencia-cargador-gan-viaje-watts-falsos",
    type: "trend",
    title: "Tendencia de cargadores GaN de viaje y watts falsos",
    h1: "Tendencia de cargadores GaN de viaje y watts falsos",
    metaDescription:
      "Por qué suben las búsquedas de cargadores GaN de viaje, qué evidencias hacen falta y qué riesgos debe revisar un comprador.",
    summary:
      "La demanda crece, pero la página solo debe avanzar si separa variante, potencia verificada, precio final y riesgo local.",
    contentMdx: "trend source signals rising evidence verified variant price risk affiliate localization update log",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"],
    headings: ["Resumen de tendencia", "Por qué está creciendo", "Señales y evidencia", "Problemas de compra relacionados", "Notas locales"]
  },
  {
    group: "trend-travel-gan-charger",
    id: "art-pt-trend-travel-gan-charger",
    locale: "pt-br",
    slug: "tendencia-carregador-gan-viagem-watts-falsos",
    type: "trend",
    title: "Tendência de carregadores GaN de viagem e watts falsos",
    h1: "Tendência de carregadores GaN de viagem e watts falsos",
    metaDescription:
      "Por que buscas por carregadores GaN de viagem estão crescendo e quais evidências reduzem risco antes da compra.",
    summary:
      "A demanda aumenta, mas a decisão editorial depende de variante, potência verificada, preço final e risco no Brasil.",
    contentMdx: "trend source signals rising evidence verified variant price risk affiliate localization update log",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"],
    headings: ["Resumo da tendência", "Por que está crescendo", "Sinais e evidências", "Problemas de compra relacionados", "Notas locais"]
  },
  {
    group: "buyer-guide-travel-gan",
    id: "art-en-buyer-guide-travel-gan",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "travel-gan-charger-buyer-guide-evidence",
    type: "buyer_guide",
    title: "Travel GaN charger buyer guide with evidence checks",
    h1: "Travel GaN charger buyer guide with evidence checks",
    metaDescription:
      "A decision framework for travel GaN chargers using verified output, SKU traps, plug options, price zones, and local risk.",
    summary:
      "Buyers should compare the exact SKU, sustained output evidence, shipped price, plug option, and return route before clicking.",
    contentMdx: "buyer guide decision framework evidence verified variant price risk affiliate offers comparison table",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title", "risk-baseus-us"],
    headings: ["Decision framework", "Who should buy or avoid", "Comparison and offer fit", "Evidence and risk blocks", "Localization notes"],
    affiliateLabel: "Check evidence-matched AliExpress offers",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  },
  {
    group: "buyer-guide-travel-gan",
    id: "art-es-buyer-guide-travel-gan",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "guia-compra-cargador-gan-viaje-evidencia",
    type: "buyer_guide",
    title: "Guía de compra de cargadores GaN de viaje con evidencia",
    h1: "Guía de compra de cargadores GaN de viaje con evidencia",
    metaDescription:
      "Marco de decisión para cargadores GaN de viaje con potencia verificada, variantes, enchufe, precio final y riesgo local.",
    summary:
      "El comprador debe revisar SKU exacta, potencia sostenida, precio con envío, enchufe y devolución antes de hacer clic.",
    contentMdx: "buyer guide decision framework evidence verified variant price risk affiliate offers comparison table",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"],
    headings: ["Marco de decisión", "Quién debería comprar o evitar", "Comparación y ofertas", "Evidencia y riesgos", "Notas locales"],
    affiliateLabel: "Ver ofertas AliExpress con evidencia",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  },
  {
    group: "buyer-guide-travel-gan",
    id: "art-pt-buyer-guide-travel-gan",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "guia-compra-carregador-gan-viagem-evidencia",
    type: "buyer_guide",
    title: "Guia de compra de carregadores GaN de viagem com evidência",
    h1: "Guia de compra de carregadores GaN de viagem com evidência",
    metaDescription:
      "Estrutura de decisão para carregadores GaN de viagem com potência verificada, variantes, plugue, preço final e risco local.",
    summary:
      "O comprador deve comparar SKU exato, potência sustentada, preço com frete, plugue e devolução antes do clique.",
    contentMdx: "buyer guide decision framework evidence verified variant price risk affiliate offers comparison table",
    evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"],
    headings: ["Estrutura de decisão", "Quem deve comprar ou evitar", "Comparação e ofertas", "Evidência e riscos", "Notas locais"],
    affiliateLabel: "Ver ofertas AliExpress com evidência",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  },
  {
    group: "deal-watch-65w-gan",
    id: "art-en-deal-watch-65w-gan",
    productId: "prod-baseus-65w",
    locale: "en",
    slug: "65w-gan-charger-deal-watch-buy-wait-avoid",
    type: "deal_watch",
    title: "65W GaN charger deal watch: buy, wait, or avoid",
    h1: "65W GaN charger deal watch: buy, wait, or avoid",
    metaDescription:
      "A no-fake-urgency deal watch for 65W GaN chargers using price history, variant traps, evidence, and local buyer risk.",
    summary:
      "A deal is only useful when the shipped price, selected SKU, verified output, and return path stay inside the buy zone.",
    contentMdx: "deal watch price history buy wait avoid zone evidence verified variant price risk affiliate offers last checked",
    evidenceIds: ["ps-baseus-us", "vc-baseus-output", "vc-baseus-temp", "sc-baseus-65w-title", "risk-baseus-us"],
    headings: ["Price history", "Buy, wait, or avoid zone", "Offer table", "Variant risk", "Last checked"],
    affiliateLabel: "Check current 65W deal",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  },
  {
    group: "deal-watch-65w-gan",
    id: "art-es-deal-watch-65w-gan",
    productId: "prod-baseus-65w",
    locale: "es",
    slug: "oferta-cargador-gan-65w-comprar-esperar-evitar",
    type: "deal_watch",
    title: "Oferta de cargador GaN 65W: comprar, esperar o evitar",
    h1: "Oferta de cargador GaN 65W: comprar, esperar o evitar",
    metaDescription:
      "Seguimiento de oferta sin urgencia falsa para cargadores GaN 65W con historial de precio, variantes y riesgo local.",
    summary:
      "Una oferta vale la pena solo cuando precio final, SKU, potencia verificada y devolución entran en la zona de compra.",
    contentMdx: "deal watch price history buy wait avoid zone evidence verified variant price risk affiliate offers last checked",
    evidenceIds: ["ps-baseus-es", "vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es"],
    headings: ["Historial de precio", "Zona de compra o espera", "Tabla de ofertas", "Riesgo de variante", "Última revisión"],
    affiliateLabel: "Ver oferta actual 65W",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  },
  {
    group: "deal-watch-65w-gan",
    id: "art-pt-deal-watch-65w-gan",
    productId: "prod-baseus-65w",
    locale: "pt-br",
    slug: "oferta-carregador-gan-65w-comprar-esperar-evitar",
    type: "deal_watch",
    title: "Oferta de carregador GaN 65W: comprar, esperar ou evitar",
    h1: "Oferta de carregador GaN 65W: comprar, esperar ou evitar",
    metaDescription:
      "Monitoramento sem urgência falsa para carregadores GaN 65W com histórico de preço, variantes e risco no Brasil.",
    summary:
      "A oferta só funciona quando preço final, SKU, potência verificada e devolução ficam dentro da zona de compra.",
    contentMdx: "deal watch price history buy wait avoid zone evidence verified variant price risk affiliate offers last checked",
    evidenceIds: ["ps-baseus-br", "vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br"],
    headings: ["Histórico de preço", "Zona de compra ou espera", "Tabela de ofertas", "Risco de variante", "Última revisão"],
    affiliateLabel: "Ver oferta atual 65W",
    affiliateHref: "https://www.aliexpress.com/item/prod-baseus-65w.html"
  },
  {
    group: "ingredient-magnesium-glycinate",
    id: "art-en-ingredient-magnesium-glycinate",
    locale: "en",
    slug: "magnesium-glycinate-supplement-evidence-safety",
    type: "ingredient_guide",
    title: "Magnesium glycinate supplement evidence and safety guide",
    h1: "Magnesium glycinate supplement evidence and safety guide",
    metaDescription:
      "A conservative magnesium glycinate guide that separates supported claims, unsupported claims, safety warnings, and iHerb offer checks.",
    summary:
      "This supplement guide is informational only and keeps iHerb offers behind evidence, disclosure, and health compliance checks.",
    contentMdx:
      "ingredient guide iherb supplement magnesium sleep evidence risk safety warning label source not medical advice consult a qualified healthcare professional affiliate offers",
    evidenceIds: ["source-magnesium-label", "source-iherb-offer", "source-health-disclaimer", "source-manual-review"],
    headings: ["What the ingredient is", "Supported claims", "Unsupported claims", "Safety warnings", "iHerb offer checks"],
    affiliateLabel: "Review iHerb magnesium options",
    affiliateHref: "https://www.iherb.com/pr/magnesium-glycinate"
  },
  {
    group: "ingredient-magnesium-glycinate",
    id: "art-es-ingredient-magnesium-glycinate",
    locale: "es",
    slug: "magnesio-glicinato-suplemento-evidencia-seguridad",
    type: "ingredient_guide",
    title: "Guía de magnesio glicinato con evidencia y seguridad",
    h1: "Guía de magnesio glicinato con evidencia y seguridad",
    metaDescription:
      "Guía conservadora de magnesio glicinato que separa afirmaciones apoyadas, no apoyadas, advertencias y ofertas iHerb.",
    summary:
      "Esta guía de suplemento es informativa y no reemplaza revisión profesional; las ofertas iHerb requieren evidencia y cumplimiento.",
    contentMdx:
      "ingredient guide iherb supplement magnesium sleep evidence risk safety warning label source not medical advice consult a qualified healthcare professional affiliate offers",
    evidenceIds: ["source-magnesium-label", "source-iherb-offer", "source-health-disclaimer", "source-manual-review"],
    headings: ["Qué es el ingrediente", "Afirmaciones apoyadas", "Afirmaciones no apoyadas", "Advertencias", "Revisión de ofertas iHerb"],
    affiliateLabel: "Revisar opciones de magnesio en iHerb",
    affiliateHref: "https://www.iherb.com/pr/magnesium-glycinate"
  },
  {
    group: "ingredient-magnesium-glycinate",
    id: "art-pt-ingredient-magnesium-glycinate",
    locale: "pt-br",
    slug: "magnesio-glicinato-suplemento-evidencia-seguranca",
    type: "ingredient_guide",
    title: "Guia de magnésio glicinato com evidência e segurança",
    h1: "Guia de magnésio glicinato com evidência e segurança",
    metaDescription:
      "Guia conservador de magnésio glicinato com alegações apoiadas, não apoiadas, avisos de segurança e ofertas iHerb.",
    summary:
      "Este guia de suplemento é informativo e não substitui orientação profissional; ofertas iHerb exigem evidência e compliance.",
    contentMdx:
      "ingredient guide iherb supplement magnesium sleep evidence risk safety warning label source not medical advice consult a qualified healthcare professional affiliate offers",
    evidenceIds: ["source-magnesium-label", "source-iherb-offer", "source-health-disclaimer", "source-manual-review"],
    headings: ["O que é o ingrediente", "Alegações apoiadas", "Alegações não apoiadas", "Avisos de segurança", "Revisão de ofertas iHerb"],
    affiliateLabel: "Revisar opções de magnésio na iHerb",
    affiliateHref: "https://www.iherb.com/pr/magnesium-glycinate"
  }
];

export function buildTrendBlogDraftArticles(
  context: TrendBlogArticleContext,
  specs: TrendBlogArticleSpec[] = trendBlogArticleSpecs
): ArticleDraft[] {
  return specs.map((spec) => buildTrendBlogArticle(spec, context));
}

export function buildTrendBlogArticle(input: TrendBlogArticleSpec, context: TrendBlogArticleContext): ArticleDraft {
  return {
    group: input.group,
    id: input.id,
    productId: input.productId,
    locale: input.locale,
    slug: input.slug,
    type: input.type,
    title: input.title,
    h1: input.h1,
    metaDescription: input.metaDescription,
    summary: input.summary,
    contentMdx: input.contentMdx,
    sections: context.sections(input.headings, input.evidenceIds),
    qualityScore: 84,
    indexStatus: "index",
    publishStatus: "published",
    healthSensitivity: input.type === "ingredient_guide" ? "high" : "none",
    complianceStatus: input.type === "ingredient_guide" ? "passed" : "unchecked",
    complianceJson:
      input.type === "ingredient_guide"
        ? {
            manualApproval: true,
            disclaimerRequired: true,
            healthClaimGuard: "passed"
          }
        : undefined,
    internalLinks: context.internalLinks(input.locale),
    affiliateLinks:
      input.affiliateLabel && input.affiliateHref
        ? [
            {
              label: input.affiliateLabel,
              href: input.affiliateHref,
              rel: "sponsored nofollow"
            }
          ]
        : [],
    evidenceIds: input.evidenceIds,
    lastUpdated: context.updatedAt
  };
}
