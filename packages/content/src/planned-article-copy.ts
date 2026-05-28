import type { ArticleType, Locale } from "@global-import-lab/types";

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
