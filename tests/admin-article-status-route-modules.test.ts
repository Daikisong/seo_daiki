import assert from "node:assert/strict";
import {
  adminPublishGateErrorPayload,
  isAdminPublishGateError
} from "../apps/web/app/api/admin/article-status/article-status-errors";
import {
  indexStatuses,
  parseOptionalIndexStatus,
  parseOptionalPublishStatus,
  parseQualityScore,
  publishStatuses,
  stringValue
} from "../apps/web/app/api/admin/article-status/article-status-values";
import { POST } from "../apps/web/app/api/admin/article-status/route";

assert.equal(typeof POST, "function");
assert.deepEqual([...indexStatuses], ["index", "noindex", "pending", "refresh_needed", "merge_candidate"]);
assert.deepEqual([...publishStatuses], ["draft", "pending", "published"]);

const form = new FormData();
form.set("value", "  article-1  ");
form.set("file", new Blob(["x"]), "evidence.txt");

assert.equal(stringValue(form.get("value")), "article-1");
assert.equal(stringValue(form.get("file")), "");
assert.deepEqual(parseOptionalIndexStatus("index"), { ok: true, value: "index" });
assert.deepEqual(parseOptionalIndexStatus(""), { ok: true });
assert.deepEqual(parseOptionalIndexStatus("bad"), { ok: false, error: "Invalid indexStatus: bad" });
assert.deepEqual(parseOptionalPublishStatus("published"), { ok: true, value: "published" });
assert.deepEqual(parseOptionalPublishStatus("bad"), { ok: false, error: "Invalid publishStatus: bad" });
assert.deepEqual(parseQualityScore(""), { ok: true });
assert.deepEqual(parseQualityScore("0"), { ok: true, value: 0 });
assert.deepEqual(parseQualityScore("100"), { ok: true, value: 100 });
assert.deepEqual(parseQualityScore("101"), { ok: false, error: "qualityScore must be an integer from 0 to 100." });
assert.deepEqual(parseQualityScore("9.5"), { ok: false, error: "qualityScore must be an integer from 0 to 100." });

const publishGateError = {
  name: "AdminPublishGateError" as const,
  articleId: "article-1",
  gateStatus: "noindex",
  gateScore: 42,
  issues: [{ code: "missing_evidence", message: "Evidence required.", severity: "blocker" as const }]
};

assert.equal(isAdminPublishGateError(publishGateError), true);
assert.equal(isAdminPublishGateError(new Error("not gate")), false);
assert.deepEqual(adminPublishGateErrorPayload(publishGateError), {
  error: "Article publish gate failed.",
  articleId: "article-1",
  gateStatus: "noindex",
  gateScore: 42,
  issues: [{ code: "missing_evidence", message: "Evidence required.", severity: "blocker" }]
});

console.log("Admin article status route module tests passed");
