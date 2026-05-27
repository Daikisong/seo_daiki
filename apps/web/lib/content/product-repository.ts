import type { Locale } from "@global-import-lab/types";
import { evidencePacks, findProduct, products } from "./sample-data";
import { withDbContent } from "./repository-source";

export async function getProduct(productId?: string) {
  return withDbContent(
    async (db) => (productId ? (await db.getDbProducts()).find((product) => product.id === productId) : undefined),
    () => findProduct(productId)
  );
}

export async function getEvidencePack(productId: string | undefined, locale: Locale) {
  return withDbContent(
    async (db) => (await db.getDbEvidencePacks()).find((pack) => pack.productId === productId && pack.locale === locale),
    () => evidencePacks.find((pack) => pack.productId === productId && pack.locale === locale)
  );
}

export async function getAllEvidencePacks() {
  return withDbContent(
    async (db) => db.getDbEvidencePacks(),
    () => evidencePacks
  );
}

export async function getProductsByCategory(category: string) {
  return withDbContent(
    async (db) => (await db.getDbProducts()).filter((product) => product.category === category),
    () => products.filter((product) => product.category === category)
  );
}

export async function getAllProducts() {
  return withDbContent(
    async (db) => db.getDbProducts(),
    () => products
  );
}
