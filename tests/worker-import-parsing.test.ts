import assert from "node:assert/strict";
import {
  claimKey,
  dateValue,
  inferBrand,
  isRecord,
  numberValue,
  parseCableIncluded,
  parsePlugType,
  parseWattage,
  priceKey,
  refreshSuggestionPayload,
  riskKey,
  signalKey,
  slugify,
  stringValue,
  uniqueRows,
  variantKey,
  verifiedClaimKey
} from "../packages/db/src/workerImportParsing";

assert.equal(stringValue("  charger  "), "charger");
assert.equal(stringValue(null), "");
assert.equal(stringValue(65), "65");

assert.equal(numberValue("65.5"), 65.5);
assert.equal(numberValue("not-a-number"), undefined);

assert.equal(isRecord({ a: 1 }), true);
assert.equal(isRecord(["a"]), false);

assert.equal(dateValue("2026-05-27")?.toISOString().slice(0, 10), "2026-05-27");
assert.equal(dateValue("bad-date"), undefined);

assert.equal(slugify("Baseus 65W GaN Charger!"), "baseus-65w-gan-charger");
assert.equal(inferBrand("Baseus 65W GaN Charger"), "Baseus");
assert.equal(inferBrand(""), undefined);

assert.equal(parseWattage("Baseus 65W EU plug"), 65);
assert.equal(parseWattage("No wattage"), undefined);
assert.equal(parsePlugType("65w eu plug"), "EU");
assert.equal(parsePlugType("65w kr plug"), undefined);
assert.equal(parseCableIncluded("with cable included"), true);
assert.equal(parseCableIncluded("without cable"), false);
assert.equal(parseCableIncluded("charger only"), undefined);

assert.equal(variantKey({ option: "EU", source_sku: "sku-1" }), "EU|undefined|sku-1|undefined");
assert.equal(claimKey({ claim_type: "wattage", claim_value: "65W" }), "wattage|undefined|65W|undefined|undefined|undefined");
assert.equal(
  verifiedClaimKey({ test_type: "wattage", result_value: "61", unit: "W", method: "USB meter" }),
  "wattage|undefined|61|undefined|W|USB meter|undefined|undefined"
);
assert.equal(signalKey({ locale: "en", topic: "heat", sentiment: "negative" }), "en|heat|negative|undefined");
assert.equal(priceKey({ country: "US", currency: "USD", price: 12, final_price: 10 }), "US|USD|12|undefined|10|undefined");
assert.equal(riskKey({ locale: "en", country: "US" }), "en|US");

assert.deepEqual(
  uniqueRows(
    [
      { id: "a", value: 1 },
      { id: "a", value: 2 },
      { id: "b", value: 3 }
    ],
    (row) => row.id
  ),
  [
    { id: "a", value: 1 },
    { id: "b", value: 3 }
  ]
);

assert.deepEqual(
  refreshSuggestionPayload({
    action: ["rewrite", 7],
    priority: "12",
    country: "US",
    device: "mobile",
    diagnostics: { ctr: 0.01 },
    missing_sections: [{ heading: "Wattage check" }],
    title_candidate: "Better title",
    meta_description_candidate: "Better meta",
    internal_link_candidates: [{ href: "/en/data/charger/" }]
  }),
  {
    action: ["rewrite", "7"],
    priority: 12,
    country: "US",
    device: "mobile",
    diagnostics: { ctr: 0.01 },
    missing_sections: [{ heading: "Wattage check" }],
    title_candidate: "Better title",
    meta_description_candidate: "Better meta",
    internal_link_candidates: [{ href: "/en/data/charger/" }]
  }
);

assert.deepEqual(refreshSuggestionPayload({ action: "rewrite", diagnostics: [] }), {
  action: [],
  priority: undefined,
  country: undefined,
  device: undefined,
  diagnostics: undefined,
  missing_sections: [],
  title_candidate: undefined,
  meta_description_candidate: undefined,
  internal_link_candidates: []
});

console.log("Worker import parsing unit tests passed");
