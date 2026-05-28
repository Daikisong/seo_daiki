import type { Product } from "@global-import-lab/types";
import { generatedProductFixtures } from "./product-fixtures";
import { buildBaseusProduct } from "./sample-product-baseus";
import { buildEssagerCableProduct } from "./sample-product-essager";
import { buildUgreenProduct } from "./sample-product-ugreen";

export function buildSampleProducts(updatedAt: string): Product[] {
  const context = { updatedAt };

  return [
    buildBaseusProduct(context),
    buildUgreenProduct(context),
    buildEssagerCableProduct(context),
    ...generatedProductFixtures(updatedAt)
  ];
}
