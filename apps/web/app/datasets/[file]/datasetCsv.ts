import type { Product } from "@global-import-lab/types";

export const DATASET_CSV_HEADER = [
  "product_id",
  "product_name",
  "category",
  "seller_claim_count",
  "verified_claim_count",
  "variant_count",
  "latest_currency",
  "latest_price",
  "latest_final_price",
  "latest_checked"
];

export function datasetRowsForFile(products: Product[], file: string) {
  const category = categoryFromDatasetFile(file);
  const rows = category ? products.filter((product) => product.category === category) : products;
  return [DATASET_CSV_HEADER, ...rows.map(productDatasetRow)];
}

export function productDatasetRow(product: Product) {
  const latestPrice = product.priceSnapshots.at(-1);
  return [
    product.id,
    product.canonicalName,
    product.category,
    String(product.sellerClaims.length),
    String(product.verifiedClaims.length),
    String(product.variants.length),
    latestPrice?.currency ?? "",
    latestPrice ? String(latestPrice.price) : "",
    latestPrice?.finalPrice === undefined ? "" : String(latestPrice.finalPrice),
    latestPrice?.capturedAt ?? ""
  ];
}

export function categoryFromDatasetFile(file: string) {
  if (file.includes("power-bank")) {
    return "power-banks";
  }
  if (file.includes("cable")) {
    return "usb-c-cables";
  }
  if (file.includes("charger") || file.includes("gan")) {
    return "usb-c-chargers";
  }
  return undefined;
}

export function toCsv(rows: string[][]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

export function csvCell(value: string) {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

export function safeFileName(file: string) {
  return file.replace(/[^a-z0-9._-]/gi, "-");
}
