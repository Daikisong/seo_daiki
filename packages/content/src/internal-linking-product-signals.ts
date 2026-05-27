import type { Product } from "@global-import-lab/types";
import { articleText } from "./internal-linking-article-text-signals";
import type { InternalLinkArticle } from "./internal-linking-types";

export function productForArticle(article: Pick<InternalLinkArticle, "productId">, products: Product[]) {
  return article.productId ? products.find((product) => product.id === article.productId) : undefined;
}

export function articleCategory(article: InternalLinkArticle, products: Product[]) {
  const productCategory = productForArticle(article, products)?.category;
  if (productCategory) {
    return productCategory;
  }

  const terms = articleText(article);
  if (terms.includes("usb-c") || terms.includes("charger") || terms.includes("cargador") || terms.includes("carregador")) {
    return "usb-c-chargers";
  }

  if (terms.includes("supplement") || terms.includes("iherb") || terms.includes("magnesium") || terms.includes("magnesio")) {
    return "supplements";
  }

  return undefined;
}

export function priceBand(product?: Product) {
  const finalPrice = product?.priceSnapshots[0]?.finalPrice ?? product?.priceSnapshots[0]?.price;
  if (finalPrice === undefined) {
    return undefined;
  }

  if (finalPrice < 10) {
    return 1;
  }

  if (finalPrice < 25) {
    return 2;
  }

  if (finalPrice < 50) {
    return 3;
  }

  return 4;
}
