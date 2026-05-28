import type { Product } from "@global-import-lab/types";
import { generatedCableProductSpecs } from "./generated-product-cable-specs";
import { generatedChargerProductSpecs } from "./generated-product-charger-specs";
import { generatedDeviceProductSpecs } from "./generated-product-device-specs";
import { generatedSampleProduct } from "./generated-product-fixture-builder";
import type { GeneratedProductSpec } from "./generated-product-fixture-types";

export const generatedProductSpecs: GeneratedProductSpec[] = [
  ...generatedChargerProductSpecs,
  ...generatedCableProductSpecs,
  ...generatedDeviceProductSpecs
];

export function generatedProductFixtures(updatedAt: string): Product[] {
  return generatedProductSpecs.map((spec) => generatedSampleProduct(spec, updatedAt));
}
