import assert from "node:assert/strict";
import { generatedCableProductSpecs } from "../packages/content/src/generated-product-cable-specs";
import { generatedChargerProductSpecs } from "../packages/content/src/generated-product-charger-specs";
import { generatedDeviceProductSpecs } from "../packages/content/src/generated-product-device-specs";
import { generatedProductSpecs } from "../packages/content/src/product-fixtures";

assert.equal(generatedChargerProductSpecs.length, 3);
assert.equal(generatedCableProductSpecs.length, 1);
assert.equal(generatedDeviceProductSpecs.length, 3);
assert.equal(generatedProductSpecs.length, 7);

assert.deepEqual(
  generatedProductSpecs.map((spec) => spec.id),
  [
    "prod-toocki-67w",
    "prod-rocoren-140w",
    "prod-kuulaa-30w",
    "prod-essager-cable-240w",
    "prod-zmi-20000-power-bank",
    "prod-hoto-screwdriver",
    "prod-tuya-zigbee-sensor"
  ]
);

assert.equal(new Set(generatedProductSpecs.map((spec) => spec.sourceSlug)).size, generatedProductSpecs.length);
assert.equal(generatedChargerProductSpecs.every((spec) => spec.category === "usb-c-chargers"), true);
assert.equal(generatedCableProductSpecs.every((spec) => spec.category === "usb-c-cables"), true);
assert.equal(generatedDeviceProductSpecs.some((spec) => spec.category === "power-banks"), true);

console.log("Generated product spec module tests passed");
