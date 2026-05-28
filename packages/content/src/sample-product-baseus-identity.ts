import type { Product } from "@global-import-lab/types";

export const baseusProductIdentity: Pick<
  Product,
  "id" | "canonicalName" | "slug" | "category" | "brandClaim" | "identityConfidence" | "imageHash"
> = {
  id: "prod-baseus-65w",
  canonicalName: "Baseus-style 65W GaN Charger",
  slug: "baseus-65w-gan-charger",
  category: "usb-c-chargers",
  brandClaim: "Baseus",
  identityConfidence: 0.86,
  imageHash: "pHash:baseus65w:8fe421"
};
