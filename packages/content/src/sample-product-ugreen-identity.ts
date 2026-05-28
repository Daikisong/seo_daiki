import type { Product } from "@global-import-lab/types";

export const ugreenProductIdentity: Pick<
  Product,
  "id" | "canonicalName" | "slug" | "category" | "brandClaim" | "identityConfidence" | "imageHash"
> = {
  id: "prod-ugreen-100w",
  canonicalName: "Ugreen-style 100W GaN Charger",
  slug: "ugreen-100w-gan-charger",
  category: "usb-c-chargers",
  brandClaim: "Ugreen",
  identityConfidence: 0.81,
  imageHash: "pHash:ugreen100w:4ab192"
};
