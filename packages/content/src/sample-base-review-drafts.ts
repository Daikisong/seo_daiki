import type { ArticleDraft } from "./article-draft-types";
import type { BaseDraftArticleContext } from "./sample-base-draft-context";

export function buildBaseReviewDrafts({
  updatedAt,
  internalLinks,
  sections
}: BaseDraftArticleContext): ArticleDraft[] {
  return [
    {
      group: "review-baseus-65w",
      id: "art-en-review-baseus",
      productId: "prod-baseus-65w",
      locale: "en",
      slug: "baseus-65w-gan-charger-real-output",
      type: "review",
      title: "AliExpress 65W GaN Charger Test: Real Output, Plug Options, and Variant Traps",
      h1: "AliExpress 65W GaN Charger Test: Which Variant Is Actually Worth Buying?",
      metaDescription:
        "We map the seller claims, verified output, plug variants, price history, review signals, and buyer risks for this AliExpress 65W GaN charger.",
      summary:
        "Good as a cheap travel charger only if the selected SKU is the real 65W variant; avoid it for certified office use.",
      contentMdx:
        "AffiliateDisclosure VerdictCard BuyAvoidCard SellerClaimTable VerifiedClaimTable VariantTrapMap PriceTruthCard ReviewSignalSummary MarketRiskMatrix AlternativesGrid EvidenceList UpdateLog variant plug cable evidence price verified",
      sections: sections(
        [
          "30-second verdict",
          "Who should buy or avoid it",
          "Seller claims vs verified facts",
          "Variant trap map",
          "Price truth",
          "Market risk by country",
          "Evidence and update log"
        ],
        ["vc-baseus-output", "vc-baseus-temp", "vc-baseus-pps-observed", "sc-baseus-65w-title", "risk-baseus-us"]
      ),
      qualityScore: 94,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("en"),
      affiliateLinks: [
        {
          label: "Check current AliExpress price",
          href: "https://example.com/go/baseus-65w-us",
          rel: "sponsored nofollow"
        }
      ],
      evidenceIds: [
        "vc-baseus-output",
        "vc-baseus-temp",
        "vc-baseus-pps-observed",
        "sc-baseus-65w-title",
        "risk-baseus-us"
      ],
      lastUpdated: updatedAt
    },
    {
      group: "review-baseus-65w",
      id: "art-es-review-baseus",
      productId: "prod-baseus-65w",
      locale: "es",
      slug: "cargador-gan-65w-baseus-potencia-real",
      type: "review",
      title: "Prueba del cargador GaN 65W de AliExpress: potencia real y variantes",
      h1: "Cargador GaN 65W de AliExpress: qué variante merece la pena",
      metaDescription:
        "Revisamos promesas del vendedor, potencia verificada, enchufe EU, señales de reseñas, precio final y riesgo de compra.",
      summary:
        "Conviene solo si eliges la variante real de 65W y el precio final no supera la zona de compra.",
      contentMdx:
        "AffiliateDisclosure VerdictCard BuyAvoidCard SellerClaimTable VerifiedClaimTable VariantTrapMap PriceTruthCard ReviewSignalSummary MarketRiskMatrix AlternativesGrid EvidenceList UpdateLog variant plug cable evidence price verified",
      sections: sections(
        [
          "Veredicto rápido",
          "Quién debería comprarlo",
          "Promesas frente a hechos",
          "Mapa de variantes",
          "Precio real",
          "Riesgo en España",
          "Evidencia"
        ],
        ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"]
      ),
      qualityScore: 90,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("es"),
      affiliateLinks: [
        {
          label: "Ver precio actual en AliExpress",
          href: "https://example.com/go/baseus-65w-eu",
          rel: "sponsored nofollow"
        }
      ],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-es", "rs-baseus-compact-es"],
      lastUpdated: updatedAt
    },
    {
      group: "review-baseus-65w",
      id: "art-pt-review-baseus",
      productId: "prod-baseus-65w",
      locale: "pt-br",
      slug: "carregador-gan-65w-baseus-potencia-real",
      type: "review",
      title: "Teste do carregador GaN 65W do AliExpress: potência real e variantes",
      h1: "Carregador GaN 65W do AliExpress: qual variante vale a pena?",
      metaDescription:
        "Mapeamos potência verificada, opções de plugue, preço final, sinais de avaliações e riscos para compradores no Brasil.",
      summary:
        "Vale como carregador de viagem barato apenas se a variante for 65W real e o risco de imposto não apagar a vantagem.",
      contentMdx:
        "AffiliateDisclosure VerdictCard BuyAvoidCard SellerClaimTable VerifiedClaimTable VariantTrapMap PriceTruthCard ReviewSignalSummary MarketRiskMatrix AlternativesGrid EvidenceList UpdateLog variant plug cable evidence price verified customs return",
      sections: sections(
        [
          "Veredito em 30 segundos",
          "Quem deve comprar ou evitar",
          "Promessas vs fatos",
          "Mapa de variantes",
          "Preço real",
          "Risco no Brasil",
          "Evidências"
        ],
        ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"]
      ),
      qualityScore: 89,
      indexStatus: "index",
      publishStatus: "published",
      internalLinks: internalLinks("pt-br"),
      affiliateLinks: [
        {
          label: "Ver preço atual no AliExpress",
          href: "https://example.com/go/baseus-65w-us",
          rel: "sponsored nofollow"
        }
      ],
      evidenceIds: ["vc-baseus-output", "vc-baseus-temp", "sc-baseus-cable", "risk-baseus-br", "rs-baseus-customs-pt"],
      lastUpdated: updatedAt
    }
  ];
}
