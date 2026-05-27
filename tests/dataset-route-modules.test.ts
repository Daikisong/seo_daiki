import assert from "node:assert/strict";
import type { Product } from "@global-import-lab/types";
import {
  categoryFromDatasetFile,
  csvCell,
  datasetRowsForFile,
  productDatasetRow,
  safeFileName,
  toCsv
} from "../apps/web/app/datasets/[file]/datasetCsv";

assert.equal(categoryFromDatasetFile("power-bank-prices.csv"), "power-banks");
assert.equal(categoryFromDatasetFile("usb-c-cable-prices.csv"), "usb-c-cables");
assert.equal(categoryFromDatasetFile("gan-charger-prices.csv"), "usb-c-chargers");
assert.equal(categoryFromDatasetFile("all-products.csv"), undefined);

assert.equal(csvCell("plain"), "plain");
assert.equal(csvCell('quoted "cell"'), '"quoted ""cell"""');
assert.equal(csvCell("two\nlines"), '"two\nlines"');
assert.equal(safeFileName("../bad file.csv"), "..-bad-file.csv");

const charger = productFixture("prod-charger", "USB-C Charger", "usb-c-chargers");
const cable = productFixture("prod-cable", "USB-C Cable", "usb-c-cables");

assert.deepEqual(productDatasetRow(charger), [
  "prod-charger",
  "USB-C Charger",
  "usb-c-chargers",
  "1",
  "1",
  "1",
  "USD",
  "19.99",
  "17.99",
  "2026-05-30T00:00:00.000Z"
]);

const chargerRows = datasetRowsForFile([charger, cable], "gan-charger-prices.csv");
assert.equal(chargerRows.length, 2);
assert.equal(chargerRows[1]?.[0], "prod-charger");

assert.equal(toCsv([["name", "price"], ["USB-C, Charger", "19.99"]]), 'name,price\n"USB-C, Charger",19.99\n');

console.log("Dataset route helper module tests passed");

function productFixture(id: string, name: string, category: string): Product {
  return {
    id,
    canonicalName: name,
    slug: id,
    category,
    identityConfidence: 0.9,
    variants: [
      {
        id: `${id}-variant`,
        productId: id,
        optionName: "Default",
        sourceUrl: "https://example.com/product"
      }
    ],
    sellerClaims: [
      {
        id: `${id}-claim`,
        productId: id,
        claimType: "name",
        claimValue: name,
        capturedAt: "2026-05-28T00:00:00.000Z",
        confidence: 0.7
      }
    ],
    verifiedClaims: [
      {
        id: `${id}-verified`,
        productId: id,
        testType: "price",
        resultValue: "ok",
        method: "manual",
        confidence: 0.8
      }
    ],
    reviewSignals: [],
    priceSnapshots: [
      {
        id: `${id}-price`,
        productId: id,
        currency: "USD",
        price: 19.99,
        finalPrice: 17.99,
        capturedAt: "2026-05-30T00:00:00.000Z"
      }
    ],
    marketRisks: []
  };
}
