import assert from "node:assert/strict";
import { toSeedJson } from "../packages/db/src/seedTypes";

const source = {
  text: "charger",
  date: new Date("2026-05-28T00:00:00.000Z"),
  nested: [{ ok: true }]
};

assert.deepEqual(toSeedJson(source), {
  text: "charger",
  date: "2026-05-28T00:00:00.000Z",
  nested: [{ ok: true }]
});

console.log("DB seed type helper unit tests passed");
