import assert from "node:assert/strict";
import {
  listValue,
  optionalBoolean,
  optionalDate,
  optionalInteger,
  optionalNumber,
  parseJson,
  required,
  requiredLocale,
  stringValue
} from "../apps/web/lib/admin/evidence-record-form-values";

const formData = new FormData();
formData.set("name", "  charger  ");
formData.set("count", "12");
formData.set("flag", "yes");
formData.set("date", "2026-05-28");
formData.set("items", "a, b\nc");
formData.set("locale", "pt-br");

assert.equal(stringValue(formData.get("name")), "charger");
assert.equal(required(formData, "name"), "charger");
assert.equal(optionalNumber(formData, "count"), 12);
assert.equal(optionalInteger(formData, "count"), 12);
assert.equal(optionalBoolean(formData, "flag"), true);
assert.equal(optionalDate(formData, "date")?.toISOString().slice(0, 10), "2026-05-28");
assert.deepEqual(listValue(formData, "items"), ["a", "b", "c"]);
assert.deepEqual(parseJson('{"ok":true}'), { ok: true });
assert.equal(requiredLocale(formData), "pt-br");

assert.throws(() => required(new FormData(), "missing"), /missing is required/);

const badNumber = new FormData();
badNumber.set("value", "abc");
assert.throws(() => optionalNumber(badNumber, "value"), /value must be numeric/);

const badBoolean = new FormData();
badBoolean.set("flag", "maybe");
assert.throws(() => optionalBoolean(badBoolean, "flag"), /flag must be true or false/);

const badLocale = new FormData();
badLocale.set("locale", "de");
assert.throws(() => requiredLocale(badLocale), /Invalid locale: de/);

console.log("Admin evidence record route value tests passed");
