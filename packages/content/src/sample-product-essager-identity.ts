import type { Product } from "@global-import-lab/types";

export const essagerCableProductIdentity: Pick<
  Product,
  "id" | "canonicalName" | "slug" | "category" | "brandClaim" | "identityConfidence" | "imageHash"
> = {
  id: "prod-essager-cable-100w",
  canonicalName: "Essager-style 100W USB-C Cable",
  slug: "essager-100w-usb-c-cable",
  category: "usb-c-cables",
  brandClaim: "Essager",
  identityConfidence: 0.77,
  imageHash: "pHash:essager100w:c94d31"
};
