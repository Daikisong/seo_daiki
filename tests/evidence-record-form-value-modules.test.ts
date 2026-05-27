import assert from "node:assert/strict";
import {
  evidenceRecordLocales,
  listValue,
  optional,
  optionalBoolean,
  optionalDate,
  optionalInteger,
  optionalNumber,
  parseJson,
  required,
  requiredLocale,
  stringValue
} from "../apps/web/lib/admin/evidence-record-form-values";
import {
  optionalBoolean as directOptionalBoolean,
  optionalDate as directOptionalDate
} from "../apps/web/lib/admin/evidence-record-boolean-date-values";
import {
  evidenceRecordLocales as directEvidenceRecordLocales,
  parseJson as directParseJson,
  requiredLocale as directRequiredLocale
} from "../apps/web/lib/admin/evidence-record-json-locale-values";
import {
  optionalInteger as directOptionalInteger,
  optionalNumber as directOptionalNumber
} from "../apps/web/lib/admin/evidence-record-number-values";
import {
  listValue as directListValue,
  optional as directOptional,
  required as directRequired,
  stringValue as directStringValue
} from "../apps/web/lib/admin/evidence-record-string-values";

assert.equal(optionalBoolean, directOptionalBoolean);
assert.equal(optionalDate, directOptionalDate);
assert.equal(evidenceRecordLocales, directEvidenceRecordLocales);
assert.equal(parseJson, directParseJson);
assert.equal(requiredLocale, directRequiredLocale);
assert.equal(optionalInteger, directOptionalInteger);
assert.equal(optionalNumber, directOptionalNumber);
assert.equal(listValue, directListValue);
assert.equal(optional, directOptional);
assert.equal(required, directRequired);
assert.equal(stringValue, directStringValue);

const formData = new FormData();
formData.set("name", "  charger  ");
formData.set("count", "12");
formData.set("flag", "yes");
formData.set("date", "2026-05-28");
formData.set("items", "a, b\nc");
formData.set("locale", "pt-br");

assert.deepEqual(evidenceRecordLocales, ["en", "es", "pt-br"]);
assert.equal(stringValue(formData.get("name")), "charger");
assert.equal(optional(formData, "missing"), undefined);
assert.equal(required(formData, "name"), "charger");
assert.equal(optionalNumber(formData, "count"), 12);
assert.equal(optionalInteger(formData, "count"), 12);
assert.equal(optionalBoolean(formData, "flag"), true);
assert.equal(optionalDate(formData, "date")?.toISOString().slice(0, 10), "2026-05-28");
assert.deepEqual(listValue(formData, "items"), ["a", "b", "c"]);
assert.deepEqual(parseJson('{"ok":true}'), { ok: true });
assert.equal(requiredLocale(formData), "pt-br");

const badInteger = new FormData();
badInteger.set("count", "12.5");
assert.throws(() => optionalInteger(badInteger, "count"), /count must be an integer/);
assert.throws(() => parseJson("{bad json"), /packJson must be valid JSON/);

console.log("Evidence record form value module tests passed");
