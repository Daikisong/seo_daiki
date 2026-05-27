import type { ArticleType, InternalLink } from "@global-import-lab/types";

export const linkableArticleTypes: ArticleType[] = [
  "hub",
  "methodology",
  "trend",
  "buyer_guide",
  "deal_watch",
  "ingredient_guide",
  "risk",
  "data",
  "lab",
  "compare",
  "guide",
  "review"
];

const linkReasonByType: Record<ArticleType, InternalLink["reason"]> = {
  hub: "category_hub",
  methodology: "methodology",
  data: "data",
  lab: "data",
  compare: "compare",
  guide: "guide",
  risk: "risk",
  review: "alternative",
  trend: "trend",
  buyer_guide: "guide",
  deal_watch: "deal",
  ingredient_guide: "ingredient"
};

export const riskIntentTokens = [
  "variant",
  "sku",
  "option",
  "plug",
  "enchufe",
  "plugue",
  "cable",
  "customs",
  "impuesto",
  "iva",
  "tax",
  "certification",
  "ce",
  "return",
  "devolucion",
  "devolução",
  "shipping",
  "frete",
  "price",
  "precio",
  "preço",
  "watts",
  "watt",
  "output",
  "potencia",
  "potência",
  "thermal",
  "heat",
  "laptop",
  "capacity",
  "torque",
  "zigbee"
];

export function linkReasonForArticleType(type: ArticleType) {
  return linkReasonByType[type];
}
