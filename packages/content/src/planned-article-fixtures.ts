import type { ArticleSection, ArticleType, InternalLink, Locale, Product } from "@global-import-lab/types";
import type { ArticleDraft, UrlPlanRow } from "./article-draft-types";

export interface PlannedArticleContext {
  products: Product[];
  updatedAt: string;
  internalLinks: (locale: Locale) => InternalLink[];
  sections: (headings: string[], evidenceIds: string[]) => ArticleSection[];
}

export const initialUrlPlan: UrlPlanRow[] = [
  { locale: "en", type: "hub", count: 5, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "data", count: 5, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "lab", count: 5, indexTarget: 4, cluster: "usb-c charging" },
  { locale: "en", type: "guide", count: 15, indexTarget: 4, cluster: "usb-c charging" },
  { locale: "en", type: "compare", count: 10, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "en", type: "review", count: 20, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "es", type: "hub", count: 3, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "es", type: "guide", count: 8, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "es", type: "compare", count: 4, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "es", type: "review", count: 10, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "pt-br", type: "hub", count: 3, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "pt-br", type: "guide", count: 8, indexTarget: 3, cluster: "usb-c charging" },
  { locale: "pt-br", type: "compare", count: 4, indexTarget: 1, cluster: "usb-c charging" },
  { locale: "pt-br", type: "review", count: 10, indexTarget: 1, cluster: "usb-c charging" }
];

export const plannedUrlTotal = initialUrlPlan.reduce((total, row) => total + row.count, 0);
export const plannedIndexTargetTotal = initialUrlPlan.reduce((total, row) => total + row.indexTarget, 0);

export function buildGeneratedDraftArticles(context: PlannedArticleContext, urlPlan: UrlPlanRow[] = initialUrlPlan): ArticleDraft[] {
  return urlPlan.flatMap((row) => Array.from({ length: row.count }, (_, index) => buildPlannedArticle(row, index + 1, context)));
}

export function buildPlannedArticle(row: UrlPlanRow, ordinal: number, context: PlannedArticleContext): ArticleDraft {
  const indexable = ordinal <= row.indexTarget;
  const product = context.products[(ordinal - 1) % context.products.length];
  const localeText = plannedLocaleText(row.locale);
  const typeText = plannedTypeText(row.type, row.locale);
  const slug = plannedSlug(row, ordinal);
  const evidenceIds = plannedEvidenceIds(context.products, row.locale, product.id);
  const productId = row.type === "hub" || row.type === "methodology" ? undefined : product.id;
  const title = `${localeText.prefix} ${typeText.title} ${ordinal}: ${localeText.clusterName}`;
  const summary = `${localeText.summary} It maps seller claims, verified evidence, variant traps, price zones, internal links, and local buyer risk before the page can be indexed.`;

  return {
    group: `planned-${row.locale}-${row.type}-${ordinal}`,
    id: `art-planned-${row.locale}-${row.type}-${String(ordinal).padStart(2, "0")}`,
    productId,
    locale: row.locale,
    slug,
    type: row.type,
    title,
    h1: `${typeText.h1} ${ordinal}: ${localeText.clusterName}`,
    metaDescription: `${localeText.meta} This planned URL is generated from the USB-C evidence inventory and uses the index gate before search exposure.`,
    summary,
    contentMdx:
      "planned inventory variant option plug cable evidence price verified customs return alternative internal links locale risk quality gate",
    sections: context.sections(
      [
        localeText.sections[0],
        localeText.sections[1],
        localeText.sections[2],
        localeText.sections[3],
        localeText.sections[4]
      ],
      evidenceIds
    ),
    qualityScore: indexable ? 84 : 62,
    indexStatus: indexable ? "index" : "pending",
    publishStatus: indexable ? "published" : "draft",
    internalLinks: context.internalLinks(row.locale),
    affiliateLinks:
      row.type === "review"
        ? [
            {
              label: localeText.affiliateLabel,
              href: product.variants[0]?.affiliateUrl ?? "https://example.com/go/import-product",
              rel: "sponsored nofollow"
            }
          ]
        : [],
    evidenceIds,
    lastUpdated: context.updatedAt
  };
}

export function plannedEvidenceIds(products: Product[], locale: Locale, productId: string) {
  const product = products.find((item) => item.id === productId) ?? products[0];
  const localeRiskId = product.marketRisks.find((risk) => risk.locale === locale)?.id ?? product.marketRisks[0]?.id;
  const reviewSignalId =
    product.reviewSignals.find((signal) => signal.locale === locale)?.id ??
    product.reviewSignals.find((signal) => signal.locale === "en")?.id;
  return [
    ...product.verifiedClaims.slice(0, 2).map((claim) => claim.id),
    ...product.sellerClaims.slice(0, 2).map((claim) => claim.id),
    reviewSignalId,
    localeRiskId
  ].filter(Boolean) as string[];
}

export function plannedSlug(row: UrlPlanRow, ordinal: number) {
  const suffix = String(ordinal).padStart(2, "0");
  const baseByLocale: Record<Locale, string> = {
    en: "usb-c-import-verification",
    es: "verificacion-importacion-usb-c",
    "pt-br": "verificacao-importacao-usb-c"
  };
  return `${baseByLocale[row.locale]}-${row.type}-${suffix}`;
}

export function plannedLocaleText(locale: Locale) {
  const copy = {
    en: {
      prefix: "USB-C import",
      clusterName: "USB-C charging evidence",
      summary: "This planned page belongs to the first 110 URL cluster for imported USB-C charging products.",
      meta: "Seller claims, evidence packs, variant traps, price truth, and local risk for imported USB-C charging products.",
      affiliateLabel: "Check current AliExpress price",
      sections: ["Search intent", "Evidence pack", "Variant and price risks", "Locale risk", "Internal links"]
    },
    es: {
      prefix: "Importación USB-C",
      clusterName: "evidencia de carga USB-C",
      summary: "Esta página planificada pertenece al primer grupo de 110 URLs sobre productos USB-C importados.",
      meta: "Promesas del vendedor, evidencias, variantes, precio real y riesgo local para productos USB-C importados.",
      affiliateLabel: "Ver precio actual en AliExpress",
      sections: ["Intención de búsqueda", "Paquete de evidencia", "Riesgos de variante y precio", "Riesgo local", "Enlaces internos"]
    },
    "pt-br": {
      prefix: "Importação USB-C",
      clusterName: "evidência de carregamento USB-C",
      summary: "Esta página planejada pertence ao primeiro grupo de 110 URLs sobre produtos USB-C importados.",
      meta: "Promessas do vendedor, evidências, variantes, preço real e risco local para produtos USB-C importados.",
      affiliateLabel: "Ver preço atual no AliExpress",
      sections: ["Intenção de busca", "Pacote de evidências", "Riscos de variante e preço", "Risco local", "Links internos"]
    }
  } satisfies Record<
    Locale,
    {
      prefix: string;
      clusterName: string;
      summary: string;
      meta: string;
      affiliateLabel: string;
      sections: string[];
    }
  >;
  return copy[locale];
}

export function plannedTypeText(type: ArticleType, locale: Locale) {
  const labels: Record<Locale, Partial<Record<ArticleType, { title: string; h1: string }>>> = {
    en: {
      hub: { title: "hub", h1: "USB-C charger hub" },
      review: { title: "review", h1: "USB-C product review" },
      guide: { title: "guide", h1: "USB-C buying guide" },
      compare: { title: "comparison", h1: "USB-C product comparison" },
      data: { title: "data table", h1: "USB-C evidence data table" },
      lab: { title: "lab note", h1: "USB-C lab note" },
      risk: { title: "country risk", h1: "USB-C import country risk" }
    },
    es: {
      hub: { title: "hub", h1: "Hub de cargadores USB-C" },
      review: { title: "reseña", h1: "Reseña de producto USB-C" },
      guide: { title: "guía", h1: "Guía de compra USB-C" },
      compare: { title: "comparativa", h1: "Comparativa de productos USB-C" },
      risk: { title: "riesgo local", h1: "Riesgo local de importación USB-C" }
    },
    "pt-br": {
      hub: { title: "hub", h1: "Hub de carregadores USB-C" },
      review: { title: "análise", h1: "Análise de produto USB-C" },
      guide: { title: "guia", h1: "Guia de compra USB-C" },
      compare: { title: "comparativo", h1: "Comparativo de produtos USB-C" },
      risk: { title: "risco local", h1: "Risco local de importação USB-C" }
    }
  };
  return labels[locale][type] ?? { title: type, h1: type };
}
